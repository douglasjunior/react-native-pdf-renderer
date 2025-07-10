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

package com.github.douglasjunior.reactNativePdfRenderer;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import com.github.douglasjunior.reactNativePdfRenderer.modules.PdfRendererViewManager;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PdfRendererPackage extends BaseReactPackage {

    @Nullable
    @Override
    public NativeModule getModule(@NonNull String s, @NonNull ReactApplicationContext reactApplicationContext) {
        if (PdfRendererViewManagerImpl.REACT_MODULE_NAME.equals(s)) {
            return new PdfRendererViewManager(reactApplicationContext);
        }
        return null;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.singletonList(new PdfRendererViewManager(reactContext));
    }

    @NonNull
    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> map = new HashMap<>();
            map.put(PdfRendererViewManagerImpl.REACT_MODULE_NAME, new ReactModuleInfo(
                    PdfRendererViewManagerImpl.REACT_MODULE_NAME, // name
                    PdfRendererViewManagerImpl.REACT_MODULE_NAME, // className
                    false,                                  // canOverrideExistingModule
                    false,                                  // needsEagerInit
                    false,                                  // isCxxModule
                    false                                   // isTurboModule
            ));
            return map;
        };
    }
}
