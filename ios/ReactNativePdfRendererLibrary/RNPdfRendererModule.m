//  MIT License
//
//  Copyright (c) 2023 Douglas Nassif Roma Junior
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

#import "RNPdfRendererModule.h"

@implementation RNPdfRendererModule

RCT_EXPORT_MODULE(RNPdfRendererView)

BOOL observerAdded = NO;

- (UIView *)view
{
    if (!observerAdded) {
        observerAdded = YES;
        [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(handlePageChange:) name:PDFViewPageChangedNotification object:nil];
    }
    
    RNPDFView *view = [[RNPDFView alloc] init];
    
    return view;
}

- (void)handlePageChange:(NSNotification*) notification {
    if ([RNPDFView class] != [notification.object class]) {
        return;
    }
    
    RNPDFView *view = notification.object;
    
    NSUInteger currentPageNumber = [view.document indexForPage:view.currentPage];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        view.onPageChange(@{
            @"position": [NSNumber numberWithInteger:currentPageNumber],
            @"total":  [NSNumber numberWithInteger:view.document.pageCount],
        });
    });
}

RCT_EXPORT_VIEW_PROPERTY(onPageChange, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(params, NSDictionary, RNPDFView)
{
    [view setParams:json];
}

RCT_CUSTOM_VIEW_PROPERTY(distanceBetweenPages, NSNumber, RNPDFView)
{
    [view setDistanceBetweenPages:json];
}

@end
