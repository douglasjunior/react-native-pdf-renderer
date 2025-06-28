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

import static com.github.douglasjunior.reactNativePdfRenderer.PdfRendererViewManagerImpl.REACT_CLASS;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.github.douglasjunior.reactNativePdfRenderer.PdfRendererViewManagerImpl;

import java.io.IOException;
import java.util.Map;

public class PdfRendererViewManager extends SimpleViewManager<PdfRendererRecyclerView> implements PdfRendererRecyclerView.PdfRendererRecyclerViewListener {
    private final ReactApplicationContext mReactApplicationContext;

    public PdfRendererViewManager(ReactApplicationContext reactApplicationContext) {
        this.mReactApplicationContext = reactApplicationContext;
    }

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
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

    @ReactProp(name = "params")
    public void setParams(PdfRendererRecyclerView view, @Nullable ReadableMap params) throws IOException {
        PdfRendererViewManagerImpl.setParams(view, params);
    }

    @ReactProp(name = "distanceBetweenPages")
    public void setDistanceBetweenPages(PdfRendererRecyclerView view, float distanceBetweenPages) {
        view.setDistanceBetweenPages(distanceBetweenPages);
    }

    @ReactProp(name = "maxPageResolution")
    public void setMaxPageResolution(PdfRendererRecyclerView view, float maxPageResolution) {
        view.setMaxPageResolution(maxPageResolution);
    }

    @Override
    public void onPageChange(PdfRendererRecyclerView target, int position, int total) {
        UIManagerModule uiManager = mReactApplicationContext.getNativeModule(UIManagerModule.class);
        if (uiManager != null) {
            int surfaceId = UIManagerHelper.getSurfaceId(mReactApplicationContext);
            uiManager.getEventDispatcher().dispatchEvent(
                    PdfRendererViewManagerImpl.createOnPageChangeEvent(surfaceId, target.getId(), position, total)
            );
        }
    }
}
