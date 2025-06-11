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

import React, {useCallback, useMemo} from 'react';
import {
  NativeSyntheticEvent,
  requireNativeComponent,
  StyleSheet,
  ViewProps,
} from 'react-native';

export type PdfRendererViewPropsType = {
  testID?: string;
  /**
   * Styles to be applied to the View.
   *
   * Note: Border radius is not supported.
   */
  style?: ViewProps['style'];
  /**
   * Path to a file stored on device.
   *
   * Ex.: `file:///path/to/file.pdf`
   */
  source?: string;
  /**
   * Distance in `DPI` between pages.
   *
   * Default: 16
   */
  distanceBetweenPages?: number;
  /**
   * Max zoom scale.
   *
   * Default: 5
   */
  maxZoom?: number;
  /**
   * (Android only)
   *
   * Max page resolution (width/height) in pixels when zooming.
   *
   * Defined to prevent Android crash when zooming too much: https://github.com/douglasjunior/react-native-pdf-renderer/issues/26
   *
   * Default: 2048
   */
  maxPageResolution?: number;
  /**
   * (Experimental)
   *
   * Renders only the first page without scroll. (useful for display thumbnail).
   *
   * Default: false
   */
  singlePage?: boolean;
  /**
   * Invoked on pages scroll.
   *
   * @param page current page number
   * @param totalPages total pages number
   */
  onPageChange?: (page: number, totalPages: number) => void;
};

type OnPageChangeEventType = {
  position: number;
  total: number;
};

const PdfRendererNative = requireNativeComponent('RNPdfRendererView') as any;

const styles = StyleSheet.create({
  default: {
    backgroundColor: 'gray',
    flex: 1,
  },
});

const PdfRendererView = ({
  testID = undefined,
  onPageChange,
  style,
  source,
  singlePage = false,
  distanceBetweenPages = 16,
  maxZoom = 5,
  maxPageResolution = 2048,
}: PdfRendererViewPropsType): React.JSX.Element => {
  const viewStyles = useMemo(
    () => [
      styles.default,
      style,
      {
        // See https://github.com/douglasjunior/react-native-pdf-renderer#limitations
        borderRadius: null,
      },
    ],
    [style],
  );

  const handlePageChange = useCallback(
    (event: NativeSyntheticEvent<OnPageChangeEventType>) => {
      onPageChange?.(event.nativeEvent.position, event.nativeEvent.total);
    },
    [onPageChange],
  );

  const params = useMemo(
    () => ({
      source,
      singlePage,
      maxZoom,
    }),
    [source, singlePage, maxZoom],
  );

  return (
    <PdfRendererNative
      testID={testID}
      maxPageResolution={maxPageResolution}
      distanceBetweenPages={distanceBetweenPages}
      style={viewStyles}
      params={params}
      onPageChange={handlePageChange}
    />
  );
};

export default PdfRendererView;
