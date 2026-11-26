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

@interface RNPDFView ()
-(void) wakeScaleTracking:(id) sender;
-(void) onScaleFrame;
@end

@interface RNPDFScaleTracker : NSObject <UIGestureRecognizerDelegate>
@property (nonatomic, weak) RNPDFView *view;
@end

@implementation RNPDFScaleTracker
-(void) onScaleFrame {
    [self.view onScaleFrame];
}

-(void) wakeScaleTracking:(id) sender {
    [self.view wakeScaleTracking:sender];
}

-(BOOL) gestureRecognizer:(UIGestureRecognizer*) gesture
        shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer*) otherGesture {
    return YES;
}
@end

@implementation RNPDFView {
    CADisplayLink * _scaleLink;
    RNPDFScaleTracker * _scaleTracker;
    NSUInteger _stableFrames;
    CGFloat _lastScale;
    BOOL _scaleReady;
    NSNumber *_pendingScrollIndex;
    NSString *_source;
    NSString *_pendingScrollSource;
    BOOL _waitingForDocumentLayout;
    NSUInteger _documentLoad;
    NSUInteger _loadingPageCount;
    PDFPage *_initialPage;
    float _initialPageMaxZoom;
}

NSNotificationName const RNPDFViewErrorNotification = @"RNPDFViewErrorNotification";
NSNotificationName const RNPDFViewScaleChangeNotification = @"RNPDFViewScaleChangeNotification";

-(instancetype) initWithFrame:(CGRect) frame {
    self = [super initWithFrame:frame];
    if (self) {
        _scaleTracker = [RNPDFScaleTracker new];
        _scaleTracker.view = self;

        UIPinchGestureRecognizer *pinch = [[UIPinchGestureRecognizer alloc] initWithTarget:_scaleTracker action:@selector(wakeScaleTracking:)];
        pinch.cancelsTouchesInView = NO;
        pinch.delaysTouchesEnded = NO;
        pinch.delegate = _scaleTracker;
        [self addGestureRecognizer:pinch];

        UITapGestureRecognizer *doubleTap = [[UITapGestureRecognizer alloc] initWithTarget:_scaleTracker action:@selector(wakeScaleTracking:)];
        doubleTap.numberOfTapsRequired = 2;
        doubleTap.cancelsTouchesInView = NO;
        doubleTap.delaysTouchesEnded = NO;
        doubleTap.delegate = _scaleTracker;
        [self addGestureRecognizer:doubleTap];

#ifndef RCT_NEW_ARCH_ENABLED
        [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(handlePageChange:) name:PDFViewPageChangedNotification object:self];
        [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(handleError:) name:RNPDFViewErrorNotification object:self];
        [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(handleScaleChange:) name:RNPDFViewScaleChangeNotification object:self];
#endif
        [NSNotificationCenter.defaultCenter addObserver:self selector:@selector(wakeScaleTracking:)
                                                  name:PDFViewScaleChangedNotification object:self];
    }
    return self;
}

-(void) didMoveToWindow {
    [super didMoveToWindow];
    [_scaleLink invalidate];
    _scaleLink = nil;
    if (self.window != nil) {
        _scaleLink = [CADisplayLink displayLinkWithTarget:_scaleTracker selector:@selector(onScaleFrame)];
        _scaleLink.paused = YES;
        [_scaleLink addToRunLoop:NSRunLoop.mainRunLoop forMode:NSRunLoopCommonModes];
    }
}

-(void) dealloc {
    [_scaleLink invalidate];
    [NSNotificationCenter.defaultCenter removeObserver:self];
}

-(void) wakeScaleTracking:(id) sender {
    _stableFrames = 0;
    _scaleLink.paused = NO;
}

-(void) onScaleFrame {
    CGFloat before = _lastScale;
    [self dispatchScaleChange];
    _stableFrames = before == _lastScale ? _stableFrames + 1 : 0;
    if (_stableFrames > 15) {
        _scaleLink.paused = YES;
        [self dispatchScaleChange:YES];
    }
}

-(void) dispatchScaleChange {
    [self dispatchScaleChange:NO];
}

-(void) dispatchScaleChange:(BOOL) force {
    if (self.document != nil && (!_scaleReady || self.minScaleFactor <= 0)) {
        return;
    }
    
    CGFloat fit = self.scaleFactorForSizeToFit > 0 ? self.scaleFactorForSizeToFit : self.minScaleFactor;
    CGFloat maxScale = self.document == nil ? 1 : MAX(1, self.maxScaleFactor / self.minScaleFactor);
    CGFloat scale = self.document == nil ? 1 : MIN(MAX(self.scaleFactor / fit, 1), maxScale);
    CGFloat lastScale = _lastScale == 0 ? 1 : _lastScale;
    
    if (scale == lastScale || (!force && scale != 1 && scale != maxScale && ABS(scale - lastScale) < 0.01)) {
        return;
    }
    
    _lastScale = scale;
    
    [NSNotificationCenter.defaultCenter postNotificationName:RNPDFViewScaleChangeNotification object:self userInfo:@{
        @"scale": [NSNumber numberWithDouble:scale],
    }];
}

#ifndef RCT_NEW_ARCH_ENABLED
- (void)handleError:(NSNotification*) notification
{
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self.onRnPdfError) {
            self.onRnPdfError(@{});
        }
    });
}

- (void)handleScaleChange:(NSNotification*) notification
{
    NSNumber *scale = notification.userInfo[@"scale"];
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self.onRnPdfScaleChange) {
            self.onRnPdfScaleChange(@{ @"scale": scale });
        }
    });
}

- (void)handlePageChange:(NSNotification*) notification
{
    if (self.onRnPdfPageChange == nil || self.document == nil || self.currentPage == nil) {
        return;
    }

    // Snapshot the page number before hopping to the main queue, so a burst of
    // notifications does not collapse several page changes into the final page.
    NSUInteger currentPageNumber = [self.document indexForPage:self.currentPage];
    NSUInteger total = self.document.pageCount;

    dispatch_async(dispatch_get_main_queue(), ^{
        if (self.onRnPdfPageChange) {
            self.onRnPdfPageChange(@{
                @"position": [NSNumber numberWithUnsignedInteger:currentPageNumber],
                @"total":  [NSNumber numberWithUnsignedInteger:total],
            });
        }
    });
}
#endif

-(void) setParams:(NSDictionary*) params {
    _scaleReady = NO;
    NSString *source = [params objectForKey:@"source"];
    NSString *maxZoomString = [params objectForKey:@"maxZoom"];
    NSString *singlePageString = [params objectForKey:@"singlePage"];
    BOOL singlePage = singlePageString != nil ? [singlePageString boolValue] : NO;
    PDFDisplayMode displayMode = singlePage ? kPDFDisplaySinglePage : kPDFDisplaySinglePageContinuous;
    
    NSUInteger documentLoad = ++_documentLoad;
    _initialPage = nil;
    if (source.length == 0 || (_pendingScrollSource.length > 0 && ![_pendingScrollSource isEqualToString:source])) {
        _pendingScrollIndex = nil;
        _pendingScrollSource = nil;
    }
    _source = source ?: @"";
    if (_pendingScrollIndex != nil) {
        _pendingScrollSource = _source;
    }
    _waitingForDocumentLayout = _source.length > 0;

    if (_waitingForDocumentLayout) {
        float maxZoom = maxZoomString != nil ? [maxZoomString floatValue] : 0;
        
        if (![source hasPrefix:@"file://"]) {
            source = [NSString stringWithFormat:@"%@%@", @"file://", source];
        }
        
        NSURL *url = [NSURL URLWithString:source];
        PDFDocument *pdfDocument = [[PDFDocument alloc] initWithURL:url];
        _loadingPageCount = pdfDocument.pageCount;
        NSInteger initialPageIndex = [[params objectForKey:@"initialPageIndex"] integerValue];
        PDFPage *initialPage = !singlePage && initialPageIndex > 0 && (NSUInteger)initialPageIndex < _loadingPageCount
            ? [pdfDocument pageAtIndex:initialPageIndex]
            : nil;
        
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
            self->_initialPage = initialPage;
            self->_initialPageMaxZoom = maxZoom;
            [self applyInitialPage];
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
          self->_scaleReady = YES;
          [self dispatchScaleChange];
          [self setNeedsLayout];
          self->_waitingForDocumentLayout = NO;
          BOOL initialPageApplied = self->_initialPage == nil;
          self->_initialPage = nil;
          NSNumber *pendingScrollIndex = nil;
          if ([self->_pendingScrollSource isEqualToString:self->_source]) {
            pendingScrollIndex = self->_pendingScrollIndex;
            self->_pendingScrollIndex = nil;
            self->_pendingScrollSource = nil;
          }
          if (pdfDocument == nil || self.document != pdfDocument) {
            return;
          }
          [self layoutIfNeeded];
          if (pendingScrollIndex != nil) {
            [self scrollToIndex:pendingScrollIndex.integerValue];
          } else if (initialPage != nil && (!initialPageApplied || self.currentPage == initialPage)) {
            // Apply it if layout never allowed it; otherwise realign after the scale reset unless the user scrolled away.
            [self goToPageTop:initialPage];
          }
        });
      });
    } else {
        self.document = nil;
        self.displayMode = displayMode;
        [self dispatchScaleChange];
    }
}

-(void) layoutSubviews {
    [super layoutSubviews];
    [self applyInitialPage];
}

-(void) applyInitialPage {
    CGFloat fitScale = self.scaleFactorForSizeToFit;
    // Before PDFKit computes a fit scale the page lands in the wrong place, so keep it for the next layout pass.
    if (_initialPage == nil || CGRectIsEmpty(self.bounds) || fitScale <= 0) {
        return;
    }
    PDFPage *page = _initialPage;
    _initialPage = nil;
    self.minScaleFactor = fitScale;
    if (_initialPageMaxZoom > 0) {
        self.maxScaleFactor = _initialPageMaxZoom * fitScale;
    }
    [self goToPageTop:page];
}

-(void) scrollToIndex:(NSInteger) index {
    [self scrollToIndex:index source:_source ?: @""];
}

-(void) scrollToIndex:(NSInteger) index source:(NSString*) source {
    if (index < 0) {
        return;
    }
    if (![source isEqualToString:_source ?: @""]) {
        if (source.length > 0) {
            _pendingScrollIndex = @(index);
            _pendingScrollSource = source;
        }
        return;
    }
    if (self.displayMode == kPDFDisplaySinglePage) {
        return;
    }
    PDFDocument *document = self.document;
    NSUInteger pageCount = _waitingForDocumentLayout ? _loadingPageCount : document.pageCount;
    if (pageCount > 0 && (NSUInteger)index >= pageCount) {
        return;
    }
    if (pageCount == 0 || _waitingForDocumentLayout) {
        _pendingScrollIndex = @(index);
        _pendingScrollSource = source;
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
    [self dispatchScaleChange];
    [self goToPageTop:[document pageAtIndex:index]];
}

-(void) goToPageTop:(PDFPage*) page {
    CGRect pageBounds = [page boundsForBox:self.displayBox];
    CGRect bounds = [self convertRect:pageBounds fromPage:page];
    CGPoint top = [self convertPoint:CGPointMake(CGRectGetMinX(bounds), CGRectGetMinY(bounds)) toPage:page];
    [self goToDestination:[[PDFDestination alloc] initWithPage:page atPoint:top]];

    // goToDestination can leave the page top slightly below the view top, so finish the alignment on PDFKit's scroll view.
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
