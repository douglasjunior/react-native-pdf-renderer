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

@implementation RNPDFView {
    NSNumber *_pendingScrollIndex;
    BOOL _hasSource;
    BOOL _waitingForDocumentLayout;
    NSUInteger _documentLoad;
    NSUInteger _loadingPageCount;
}

NSNotificationName const RNPDFViewErrorNotification = @"RNPDFViewErrorNotification";

-(void) setParams:(NSDictionary*) params {
    NSString *source = [params objectForKey:@"source"];
    NSString *maxZoomString = [params objectForKey:@"maxZoom"];
    NSString *singlePageString = [params objectForKey:@"singlePage"];
    BOOL singlePage = singlePageString != nil ? [singlePageString boolValue] : NO;
    PDFDisplayMode displayMode = singlePage ? kPDFDisplaySinglePage : kPDFDisplaySinglePageContinuous;
    
    NSUInteger documentLoad = ++_documentLoad;
    if (_hasSource || source.length == 0) {
        _pendingScrollIndex = nil;
    }
    _hasSource = source.length > 0;
    _waitingForDocumentLayout = _hasSource;

    if (_hasSource) {
        float maxZoom = maxZoomString != nil ? [maxZoomString floatValue] : 0;
        
        if (![source hasPrefix:@"file://"]) {
            source = [NSString stringWithFormat:@"%@%@", @"file://", source];
        }
        
        NSURL *url = [NSURL URLWithString:source];
        PDFDocument *pdfDocument = [[PDFDocument alloc] initWithURL:url];
        _loadingPageCount = pdfDocument.pageCount;
        
        self.autoScales = YES;
        self.displayDirection = kPDFDisplayDirectionVertical;
        self.displaysPageBreaks = YES;
        if (@available(iOS 12.0, *)) {
            self.pageShadowsEnabled = NO;
        }
        self.displayMode = displayMode;
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (documentLoad != self->_documentLoad) {
                return;
            }
            if (pdfDocument == nil || pdfDocument.pageCount == 0) {
                [NSNotificationCenter.defaultCenter postNotificationName:RNPDFViewErrorNotification object:self];
                return;
            }
            self.document = pdfDocument;
        });
        
      dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        // In certain scenarios, scaleFactorForSizeToFit may be 0.
        // This results in invalid calculations for the CoreGraphics API, affecting the PDF positioning.
        // Consequence: PDF displayed in the wrong position and zoom unavailable.
        // This is a temporary workaround to handle the production bug until a better approach is implemented.
        sleep(1);
        
        dispatch_async(dispatch_get_main_queue(), ^{
          if (documentLoad != self->_documentLoad) {
            return;
          }
          self.minScaleFactor = self.scaleFactorForSizeToFit == 0 ? 1 : self.scaleFactorForSizeToFit;
          if (maxZoom > 0) {
            self.maxScaleFactor = maxZoom * self.minScaleFactor;
          }
          [self setNeedsLayout];
          self->_waitingForDocumentLayout = NO;
          NSNumber *pendingScrollIndex = self->_pendingScrollIndex;
          self->_pendingScrollIndex = nil;
          if (pendingScrollIndex != nil && pdfDocument != nil && self.document == pdfDocument) {
            [self layoutIfNeeded];
            [self scrollToIndex:pendingScrollIndex.integerValue];
          }
        });
      });
    } else {
        self.document = nil;
        self.displayMode = displayMode;
    }
}

-(void) scrollToIndex:(NSInteger) index {
    if (self.displayMode == kPDFDisplaySinglePage || index < 0) {
        return;
    }
    PDFDocument *document = self.document;
    NSUInteger pageCount = _waitingForDocumentLayout ? _loadingPageCount : document.pageCount;
    if (pageCount > 0 && (NSUInteger)index >= pageCount) {
        return;
    }
    if (pageCount == 0 || _waitingForDocumentLayout) {
        _pendingScrollIndex = @(index);
        return;
    }

    CGFloat minScale = self.minScaleFactor;
    CGFloat fitScale = self.scaleFactorForSizeToFit;
    if (fitScale > 0 && fitScale != minScale) {
        CGFloat maxScale = self.maxScaleFactor;
        CGFloat zoomLimit = minScale > 0 ? MAX(1, maxScale / minScale) : 1;
        if (fitScale > maxScale) {
            self.maxScaleFactor = fitScale * zoomLimit;
            self.minScaleFactor = fitScale;
        } else {
            self.minScaleFactor = fitScale;
            self.maxScaleFactor = fitScale * zoomLimit;
        }
    }
    self.scaleFactor = self.minScaleFactor;
    PDFPage *page = [document pageAtIndex:index];
    CGRect pageBounds = [page boundsForBox:self.displayBox];
    CGRect bounds = [self convertRect:pageBounds fromPage:page];
    CGPoint top = [self convertPoint:CGPointMake(CGRectGetMinX(bounds), CGRectGetMinY(bounds)) toPage:page];
    [self goToDestination:[[PDFDestination alloc] initWithPage:page atPoint:top]];

    CGFloat remainingOffset = CGRectGetMinY([self convertRect:pageBounds fromPage:page]) - CGRectGetMinY(self.bounds);
    if (remainingOffset > 1) {
        UIView *ancestor = self.documentView.superview;
        while (ancestor != nil && ancestor != self && ![ancestor isKindOfClass:UIScrollView.class]) {
            ancestor = ancestor.superview;
        }
        if ([ancestor isKindOfClass:UIScrollView.class]) {
            UIScrollView *scrollView = (UIScrollView*) ancestor;
            CGFloat maxOffsetY = MAX(0, scrollView.contentSize.height - scrollView.bounds.size.height + scrollView.adjustedContentInset.bottom);
            CGPoint offset = scrollView.contentOffset;
            offset.y = MIN(offset.y + remainingOffset, maxOffsetY);
            [scrollView setContentOffset:offset animated:NO];
        }
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
