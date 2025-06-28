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

import type { HostComponent, ViewProps } from 'react-native';
import {
  BubblingEventHandler,
  Float,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type NativeParams = {
  source?: string;
  singlePage: boolean;
  maxZoom: Float;
};

type PageChangeEventPayload = {
  position: Int32;
  total: Int32;
};

export interface NativeProps extends ViewProps {
  maxPageResolution: Float;
  distanceBetweenPages: Float;
  params: NativeParams;
  onPageChange: BubblingEventHandler<PageChangeEventPayload>;
}

export default codegenNativeComponent<NativeProps>(
  'RNPdfRendererView',
) as HostComponent<NativeProps>;
