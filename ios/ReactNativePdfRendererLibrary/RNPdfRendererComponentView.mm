//  MIT License
//
//  Copyright (c) 2025 Douglas Nassif Roma Junior
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.
//
//  Created by Douglas Nassif Roma Junior on 08/03/23.
//

#ifdef RCT_NEW_ARCH_ENABLED

#import "RNPdfRendererComponentView.h"

#import <react/renderer/components/rnpdfrenderer_codegen/ComponentDescriptors.h>
#import <react/renderer/components/rnpdfrenderer_codegen/EventEmitters.h>
#import <react/renderer/components/rnpdfrenderer_codegen/Props.h>
#import <react/renderer/components/rnpdfrenderer_codegen/RCTComponentViewHelpers.h>

using namespace facebook::react;

@interface RNPdfRendererComponentView () <RCTRNPdfRendererViewViewProtocol>
@end

@implementation RNPdfRendererComponentView {
    RNPDFView * _pdfView;
}

BOOL observerAdded = NO;

-(instancetype)init
{
    if (!observerAdded) {
        observerAdded = YES;
        [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(handlePageChange:) name:PDFViewPageChangedNotification object:nil];
        [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(handleError:) name:RNPDFViewErrorNotification object:nil];
    }
    if(self = [super init]) {
        _pdfView = [RNPDFView new];
        _pdfView.backgroundColor = UIColor.clearColor;
        [self addSubview:_pdfView];
    }
    return self;
}

- (void)dealloc
{
    if (observerAdded) {
        observerAdded = NO;
        [NSNotificationCenter.defaultCenter removeObserver:self name:PDFViewPageChangedNotification object:nil];
    }
}

- (void) handleError:(NSNotification*) notification {
    if (notification.object != _pdfView) {
        return;
    }
    
    if (_eventEmitter) {
        self.eventEmitter.onError({});
    }
}

- (void)handlePageChange:(NSNotification*) notification {
    if (notification.object != _pdfView) {
        return;
    }
    
    NSUInteger currentPageNumber = [_pdfView.document indexForPage:_pdfView.currentPage];
    
    RNPdfRendererViewEventEmitter::OnPageChange result = RNPdfRendererViewEventEmitter::OnPageChange{};
    result.position = currentPageNumber;
    result.total = _pdfView.document.pageCount;
    
    if (_eventEmitter) {
        self.eventEmitter.onPageChange(result);
    }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<RNPdfRendererViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RNPdfRendererViewProps const>(props);
    
    if (oldViewProps.params.source != newViewProps.params.source ||
        oldViewProps.params.maxZoom != newViewProps.params.maxZoom ||
        oldViewProps.params.singlePage != newViewProps.params.singlePage) {
        
        NSString *sourceString = [NSString stringWithUTF8String:newViewProps.params.source.c_str()];
        
        NSDictionary* params = @{
            @"source": sourceString,
            @"maxZoom": @(newViewProps.params.maxZoom),
            @"singlePage": @(newViewProps.params.singlePage)
        };
        
        [_pdfView setParams: params];
        
        [self setNeedsLayout];
    }
    
    if (oldViewProps.distanceBetweenPages != newViewProps.distanceBetweenPages) {
        [_pdfView setDistanceBetweenPages: @(newViewProps.distanceBetweenPages)];
    }
    
    [super updateProps:props oldProps:oldProps];
}

-(void)layoutSubviews
{
    [super layoutSubviews];
    _pdfView.frame = self.bounds;
}

// Event emitter convenience method
- (const RNPdfRendererViewEventEmitter &)eventEmitter
{
    return static_cast<const RNPdfRendererViewEventEmitter &>(*_eventEmitter);
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RNPdfRendererViewComponentDescriptor>();
}

@end

#endif // RCT_NEW_ARCH_ENABLED
