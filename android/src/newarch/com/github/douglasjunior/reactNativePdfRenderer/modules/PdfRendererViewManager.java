// MIT License

// Copyright (c) 2025 Douglas Nassif Roma Junior

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

import static com.github.douglasjunior.reactNativePdfRenderer.PdfRendererViewManagerImpl.REACT_MODULE_NAME;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.viewmanagers.RNPdfRendererViewManagerInterface;
import com.github.douglasjunior.reactNativePdfRenderer.PdfRendererViewManagerImpl;

import java.util.Map;

@ReactModule(name = REACT_MODULE_NAME)
public class PdfRendererViewManager extends SimpleViewManager<PdfRendererRecyclerView> implements RNPdfRendererViewManagerInterface<PdfRendererRecyclerView>, PdfRendererRecyclerView.PdfRendererRecyclerViewListener {

    private final ReactApplicationContext mReactApplicationContext;

    public PdfRendererViewManager(ReactApplicationContext reactApplicationContext) {
        this.mReactApplicationContext = reactApplicationContext;
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_MODULE_NAME;
    }

    @NonNull
    @Override
    protected PdfRendererRecyclerView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        return new PdfRendererRecyclerView(mReactApplicationContext, this);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return PdfRendererViewManagerImpl.getExportedCustomBubblingEventTypeConstants();
    }

    private void sendEvent(PdfRendererRecyclerView target, Event<?> event) {
        EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(
                mReactApplicationContext,
                target.getId()
        );

        if (eventDispatcher != null) {
            eventDispatcher.dispatchEvent(
                    event
            );
        }
    }

    @Override
    public void onPageChange(PdfRendererRecyclerView target, int position, int total) {
        int surfaceId = UIManagerHelper.getSurfaceId(mReactApplicationContext);
        sendEvent(
                target,
                PdfRendererViewManagerImpl.createOnPageChangeEvent(surfaceId, target.getId(), position, total)
        );
    }

    private void onError(PdfRendererRecyclerView target) {
        int surfaceId = UIManagerHelper.getSurfaceId(mReactApplicationContext);
        sendEvent(
                target,
                PdfRendererViewManagerImpl.createOnErrorEvent(surfaceId, target.getId())
        );
    }

    @ReactProp(name = "maxPageResolution")
    @Override
    public void setMaxPageResolution(PdfRendererRecyclerView view, float value) {
        view.setMaxPageResolution(value);
    }

    @ReactProp(name = "distanceBetweenPages")
    @Override
    public void setDistanceBetweenPages(PdfRendererRecyclerView view, float value) {
        view.setDistanceBetweenPages(value);
    }

    @ReactProp(name = "params")
    @Override
    public void setParams(PdfRendererRecyclerView view, @Nullable ReadableMap params) {
        PdfRendererViewManagerImpl.setParams(view, params, () -> onError(view));
    }
}
