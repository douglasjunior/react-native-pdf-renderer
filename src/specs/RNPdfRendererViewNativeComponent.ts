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

import type * as React from 'react';
import type { CodegenTypes, HostComponent, ViewProps } from 'react-native';
import { codegenNativeCommands, codegenNativeComponent } from 'react-native';

export type NativeParams = {
  source?: string;
  singlePage: boolean;
  maxZoom: CodegenTypes.Float;
};

type PageChangeEventPayload = {
  position: CodegenTypes.Int32;
  total: CodegenTypes.Int32;
};

type ScaleChangeEventPayload = {
  scale: CodegenTypes.Float;
};

export interface NativeProps extends ViewProps {
  maxPageResolution: CodegenTypes.Float;
  distanceBetweenPages: CodegenTypes.Float;
  params: NativeParams;
  onPageChange: CodegenTypes.BubblingEventHandler<PageChangeEventPayload>;
  onScaleChange: CodegenTypes.BubblingEventHandler<ScaleChangeEventPayload>;
  onError: CodegenTypes.BubblingEventHandler<{}>;
}

interface NativeCommands {
  scrollToIndex: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    index: CodegenTypes.Int32,
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['scrollToIndex'],
});

export default codegenNativeComponent<NativeProps>(
  'RNPdfRendererView',
) as HostComponent<NativeProps>;
