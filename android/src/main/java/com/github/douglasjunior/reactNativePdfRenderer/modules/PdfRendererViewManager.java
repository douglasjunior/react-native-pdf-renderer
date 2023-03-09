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

import android.util.Log;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.io.IOException;
import java.util.Map;

public class PdfRendererViewManager extends SimpleViewManager<ViewGroup> {

    private ReactApplicationContext mReactApplicationContext;

    public PdfRendererViewManager(ReactApplicationContext reactApplicationContext) {
        this.mReactApplicationContext = reactApplicationContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "RNPdfRendererView";
    }

    @NonNull
    @Override
    protected ViewGroup createViewInstance(@NonNull ThemedReactContext themedReactContext) {
        LinearLayout layout = new LinearLayout(themedReactContext);
        layout.setOrientation(LinearLayout.VERTICAL);

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

        PdfRendererRecyclerView recyclerView = new PdfRendererRecyclerView(mReactApplicationContext, layout);
        recyclerView.setLayoutParams(params);

        layout.addView(recyclerView);

        layout.setClipToOutline(true);

        return layout;
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        Map map = super.getExportedCustomBubblingEventTypeConstants();
        map.put("pageChange", MapBuilder.of(
                "phasedRegistrationNames",
                MapBuilder.of("bubbled", "onPageChange")
        ));
        return map;
    }

    @ReactProp(name = "source")
    public void setSource(ViewGroup layout, @Nullable String source) throws IOException {
        Log.d("PdfRendererViewManager", "setSource");
        PdfRendererRecyclerView recyclerView = (PdfRendererRecyclerView) layout.getChildAt(0);

        if (source != null) {
            recyclerView.updateSource(source);
        } else {
            recyclerView.closeAdapter();
        }

        recyclerView.forceRequestLayout();
    }

    @ReactProp(name = "distanceBetweenPages")
    public void setDistanceBetweenPages(ViewGroup layout, @Nullable float distanceBetweenPages) {
        PdfRendererRecyclerView recyclerView = (PdfRendererRecyclerView) layout.getChildAt(0);
        recyclerView.setDistanceBetweenPages(distanceBetweenPages);
    }

    @ReactProp(name = "maxZoom")
    public void setMaxZoom(ViewGroup layout, @Nullable float maxZoom) {
        PdfRendererRecyclerView recyclerView = (PdfRendererRecyclerView) layout.getChildAt(0);
        recyclerView.setMaxZoom(maxZoom);
    }

}
