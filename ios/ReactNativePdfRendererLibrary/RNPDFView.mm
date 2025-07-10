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

#import "RNPDFView.h"

@implementation RNPDFView

NSNotificationName const RNPDFViewErrorNotification = @"RNPDFViewErrorNotification";

-(void) setParams:(NSDictionary*) params {
    NSString *source = [params objectForKey:@"source"];
    NSString *maxZoomString = [params objectForKey:@"maxZoom"];
    NSString *singlePageString = [params objectForKey:@"singlePage"];
    
    if (source != nil) {
        float maxZoom = maxZoomString != nil ? [maxZoomString floatValue] : 0;
        BOOL singlePage = singlePageString != nil ? [singlePageString boolValue] : NO;
        
        if (![source hasPrefix:@"file://"]) {
            source = [NSString stringWithFormat:@"%@%@", @"file://", source];
        }
        
        NSURL *url = [NSURL URLWithString:source];
        PDFDocument *pdfDocument = [[PDFDocument alloc] initWithURL:url];
        
        self.autoScales = YES;
        self.displayDirection = kPDFDisplayDirectionVertical;
        self.displaysPageBreaks = YES;
        if (@available(iOS 12.0, *)) {
            self.pageShadowsEnabled = NO;
        }
        self.displayMode = singlePage ? kPDFDisplaySinglePage : kPDFDisplaySinglePageContinuous;
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (pdfDocument == nil || pdfDocument.pageCount == 0) {
                [NSNotificationCenter.defaultCenter postNotificationName:RNPDFViewErrorNotification object:self];
                return;
            }
            self.document = pdfDocument;
        });
        
        dispatch_async(dispatch_get_main_queue(), ^{
            self.minScaleFactor = self.scaleFactorForSizeToFit;
            if (maxZoom > 0) {
                self.maxScaleFactor = self.scaleFactorForSizeToFit * maxZoom;
            }
            [self setNeedsLayout];
        });
    } else {
        self.document = nil;
    }
}

-(void) setDistanceBetweenPages:(NSNumber*) distance {
    float marginBottom = distance != nil && self.displayMode == kPDFDisplaySinglePageContinuous
    ? [distance floatValue]
    : 0;
    
    self.pageBreakMargins = UIEdgeInsetsMake(0, 0, marginBottom, 0);
    
    [self setNeedsLayout];
}

@end
