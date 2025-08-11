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

-(void) setParams:(NSDictionary*) params {
    NSString *source = [params objectForKey:@"source"];
    
    float maxZoom = [params objectForKey:@"maxZoom"] != nil
    ? [[params objectForKey:@"maxZoom"] floatValue]
    : 0;
    
    BOOL singlePage = [params objectForKey:@"singlePage"] != nil
    ? [[params objectForKey:@"singlePage"] boolValue]
    : NO;
    
    if ([params objectForKey:@"source"] != nil) {
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
        
        self.document = pdfDocument;
        
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            // In certain scenarios, scaleFactorForSizeToFit may be 0.
            // This results in invalid calculations for the CoreGraphics API, affecting the PDF positioning.
            // Consequence: PDF displayed in the wrong position and zoom unavailable.
            // This is a temporary workaround to handle the production bug until a better approach is implemented.
            sleep(1);
            
            dispatch_async(dispatch_get_main_queue(), ^{
                self.minScaleFactor = self.scaleFactorForSizeToFit == 0 ? 1 : self.scaleFactorForSizeToFit;
                if (maxZoom > 0) {
                    self.maxScaleFactor = maxZoom * self.minScaleFactor;
                }
                [self setNeedsLayout];
            });
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
