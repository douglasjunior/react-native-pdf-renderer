// MIT License

// Copyright (c) 2023 Douglas Nassif Roma Junior

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

import java.util.HashSet;
import java.util.Set;

public class ObservableZoom {
    private final Set<ZoomChangeListener> listeners = new HashSet<>();
    private float zoom;

    public ObservableZoom(int initialZoom) {
        this.zoom = initialZoom;
    }

    public void addListener(ZoomChangeListener listener) {
        this.listeners.add(listener);
    }

    public void removeListener(ZoomChangeListener zoomListener) {
        this.listeners.remove(zoomListener);
    }

    private void notifyListeners() {
        for (ZoomChangeListener listener : listeners) {
            listener.onZoomChange(this.zoom);
        }
    }

    public float getZoom() {
        return zoom;
    }

    public void setZoom(float newZoom) {
        if (newZoom == this.zoom) return;
        this.zoom = newZoom;
        notifyListeners();
    }

    public interface ZoomChangeListener {
        void onZoomChange(float newZoom);
    }
}
