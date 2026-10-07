// MIT License

// Copyright (c) 2026 Douglas Nassif Roma Junior

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

package com.github.douglasjunior.reactNativePdfRenderer.modules;

/**
 * Decides whether an observed scale should be reported to JavaScript, and with
 * which value. It clamps the observed scale to the allowed range and suppresses
 * repeats and imperceptible changes, so the event is emitted only on the frames
 * where the effective scale moves by a meaningful amount.
 * <p>
 * This is the <b>event</b> trail. It is deliberately separate from
 * {@link ObservableZoom}, which drives page bitmap re-rendering and is notified
 * only when a gesture ends.
 */
public class ScaleTracker {
    /**
     * Smallest scale change worth a round trip to JavaScript.
     * <p>
     * {@link android.view.ScaleGestureDetector} reports a new scale on every touch
     * move, and every event costs the consumer a re-render, so a slow pinch used to
     * emit one per touch sample while moving the image by nothing visible. This caps
     * the event count by distance travelled instead: about 100 per unit of scale, a
     * step below what is perceptible at any zoom this view allows. A fast pinch
     * across the whole range is unaffected, since each of its frames already moves
     * further than this.
     */
    private static final float SCALE_EPSILON = 0.01f;

    private final float minScale;
    private float maxScale;
    private float lastDispatchedScale;

    public ScaleTracker(float minScale, float maxScale) {
        this.minScale = minScale;
        this.maxScale = maxScale;
        this.lastDispatchedScale = minScale;
    }

    public void setMaxScale(float maxScale) {
        this.maxScale = maxScale;
    }

    /**
     * @return the last value accepted by {@link #shouldDispatch(float)}, already clamped.
     */
    public float getScale() {
        return lastDispatchedScale;
    }

    /**
     * @param rawScale the scale read from the view matrix.
     * @return true when the clamped scale differs meaningfully from the last accepted
     * one, in which case it becomes the new last accepted value.
     */
    public boolean shouldDispatch(float rawScale) {
        var clamped = Math.min(Math.max(rawScale, minScale), maxScale);
        if (clamped == lastDispatchedScale) return false;

        /*
         * The limits themselves always go through, even when the step into them is
         * smaller than the epsilon, so JavaScript ends a gesture holding the exact
         * min/max rather than a value just short of it.
         */
        var isLimit = clamped == minScale || clamped == maxScale;
        if (!isLimit && Math.abs(clamped - lastDispatchedScale) < SCALE_EPSILON) return false;

        lastDispatchedScale = clamped;
        return true;
    }
}
