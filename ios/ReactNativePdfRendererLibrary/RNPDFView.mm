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
}

NSNotificationName const RNPDFViewErrorNotification = @"RNPDFViewErrorNotification";
NSNotificationName const RNPDFViewScaleChangeNotification = @"RNPDFViewScaleChangeNotification";

-(instancetype) initWithFrame:(CGRect) frame {
    self = [super initWithFrame:frame];
    if (self) {
        _scaleTracker = [RNPDFScaleTracker new];
        _scaleTracker.view = self;

        UIPinchGestureRecognizer *pinch = [[UIPinchGestureRecognizer alloc] initWithTarget:_scaleTracker action:@selector(wakeScaleTracking:)];
        pinch.delegate = _scaleTracker;
        [self addGestureRecognizer:pinch];

        UITapGestureRecognizer *doubleTap = [[UITapGestureRecognizer alloc] initWithTarget:_scaleTracker action:@selector(wakeScaleTracking:)];
        doubleTap.numberOfTapsRequired = 2;
        doubleTap.delegate = _scaleTracker;
        [self addGestureRecognizer:doubleTap];

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
    [NSNotificationCenter.defaultCenter removeObserver:self name:PDFViewScaleChangedNotification object:self];
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
    }
}

-(void) dispatchScaleChange {
    if (self.document != nil && (!_scaleReady || self.minScaleFactor <= 0)) {
        return;
    }
    
    CGFloat fit = self.scaleFactorForSizeToFit > 0 ? self.scaleFactorForSizeToFit : self.minScaleFactor;
    CGFloat maxScale = self.document == nil ? 1 : MAX(1, self.maxScaleFactor / self.minScaleFactor);
    CGFloat scale = self.document == nil ? 1 : MIN(MAX(self.scaleFactor / fit, 1), maxScale);
    CGFloat lastScale = _lastScale == 0 ? 1 : _lastScale;
    
    if (scale == lastScale || (scale != 1 && scale != maxScale && ABS(scale - lastScale) < 0.01)) {
        return;
    }
    
    _lastScale = scale;
    
    [NSNotificationCenter.defaultCenter postNotificationName:RNPDFViewScaleChangeNotification object:self userInfo:@{
        @"scale": [NSNumber numberWithDouble:scale],
    }];
}

-(void) setParams:(NSDictionary*) params {
    _scaleReady = NO;
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
          self->_scaleReady = YES;
          [self dispatchScaleChange];
          [self setNeedsLayout];
        });
      });
    } else {
        self.document = nil;
        [self dispatchScaleChange];
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
