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

package com.github.douglasjunior.reactNativePdfRenderer;

import android.text.TextUtils;
import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.github.douglasjunior.reactNativePdfRenderer.modules.PdfRendererRecyclerView;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class PdfRendererViewManagerImpl {
    public static final String REACT_MODULE_NAME = "RNPdfRendererView";
    private static final String ON_PAGE_CHANGE_EVENT = "onPageChange";
    private static final String ON_ERROR_EVENT = "onError";

    public static Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return new HashMap<>() {{
            put(ON_PAGE_CHANGE_EVENT, new HashMap<>() {{
                put("phasedRegistrationNames", new HashMap<String, String>() {{
                    put("bubbled", ON_PAGE_CHANGE_EVENT);
                }});
            }});
            put(ON_ERROR_EVENT, new HashMap<>() {{
                put("phasedRegistrationNames", new HashMap<String, String>() {{
                    put("bubbled", ON_ERROR_EVENT);
                }});
            }});
        }};
    }

    public static void setParams(PdfRendererRecyclerView view, ReadableMap params, Runnable errorCallback) {
        if (params == null) return;

        var source = params.getString("source");
        var singlePage = params.hasKey("singlePage") && params.getBoolean("singlePage");
        var maxZoom = params.hasKey("maxZoom") ? Double.valueOf(params.getDouble("maxZoom")).floatValue() : 5;

        if (TextUtils.isEmpty(source)) return;
        var file = new File(source.replace("file://", ""));

        view.post(() -> {
            try {
                view.setSinglePage(singlePage);
                view.setMaxZoom(maxZoom);
                view.setOverScrollMode(singlePage ? View.OVER_SCROLL_NEVER : View.OVER_SCROLL_IF_CONTENT_SCROLLS);

                view.updateSource(file);

                view.forceRequestLayout();
            } catch (IOException e) {
                if (BuildConfig.DEBUG) {
                    // noinspection CallToPrintStackTrace
                    e.printStackTrace();
                }
                errorCallback.run();
            }
        });
    }

    public static Event<?> createOnPageChangeEvent(int surfaceId, int targetId, int position, int total) {
        return new Event(surfaceId, targetId) {
            @NonNull
            @Override
            public String getEventName() {
                return ON_PAGE_CHANGE_EVENT;
            }

            @Override
            protected WritableMap getEventData() {
                var data = Arguments.createMap();
                data.putInt("position", position);
                data.putInt("total", total);
                return data;
            }
        };
    }

    public static Event<?> createOnErrorEvent(int surfaceId, int targetId) {
        return new Event(surfaceId, targetId) {
            @NonNull
            @Override
            public String getEventName() {
                return ON_ERROR_EVENT;
            }
        };
    }
}
