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

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import PdfRendererNative, {
  Commands,
  NativeParams,
} from './specs/RNPdfRendererViewNativeComponent';

export type PdfRendererViewPropsType = {
  testID?: string;
  /**
   * Styles to be applied to the View.
   *
   * Note: Border radius is not supported.
   */
  style?: StyleProp<ViewStyle>;
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
  /**
   * (Android only)
   *
   * Invoked when the zoom scale changes, continuously while the pinch gesture
   * is in progress.
   *
   * `1` is the unzoomed baseline: the page at its laid-out size, which is
   * fit-to-width in multi-page mode and fit-to-center when `singlePage` is set.
   * The value never exceeds `maxZoom`.
   *
   * @param scale current zoom scale
   */
  onScaleChange?: (scale: number) => void;
  /**
   * Invoked when an error occurs.
   */
  onError?: () => void;
};

export type PdfRendererViewRefType = {
  /**
   * Scrolls to the page at the given index, resetting the zoom first.
   *
   * The index is 0-based, the same `page` value reported by `onPageChange`:
   * `0` is the first page and `totalPages - 1` is the last one.
   *
   * Does nothing when the index is out of range or when `singlePage` is set.
   * When called before the document finishes loading, the scroll is applied
   * as soon as it loads.
   *
   * @param index 0-based page index
   */
  scrollToIndex: (index: number) => void;
};

type OnPageChangeEventType = {
  position: number;
  total: number;
};

type OnScaleChangeEventType = {
  scale: number;
};

const styles = StyleSheet.create({
  default: {
    backgroundColor: 'gray',
    flex: 1,
  },
});

const PdfRendererView = (
  {
    testID = undefined,
    onPageChange,
    onScaleChange,
    onError = undefined,
    style,
    source,
    singlePage = false,
    distanceBetweenPages = 16,
    maxZoom = 5,
    maxPageResolution = 2048,
  }: PdfRendererViewPropsType,
  ref: React.ForwardedRef<PdfRendererViewRefType>,
): React.JSX.Element => {
  const nativeRef = useRef<React.ElementRef<typeof PdfRendererNative>>(null);

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index: number) => {
        if (Platform.OS !== 'android' || !nativeRef.current) {
          return;
        }
        Commands.scrollToIndex(nativeRef.current, index);
      },
    }),
    [],
  );

  const viewStyles: StyleProp<ViewStyle> = useMemo(
    () => [
      styles.default,
      style,
      {
        // See https://github.com/douglasjunior/react-native-pdf-renderer#limitations
        borderRadius: undefined,
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

  const handleScaleChange = useCallback(
    (event: NativeSyntheticEvent<OnScaleChangeEventType>) => {
      onScaleChange?.(event.nativeEvent.scale);
    },
    [onScaleChange],
  );

  const handleError = useCallback((event: NativeSyntheticEvent<{}>) => {
    if (!onError && __DEV__) {
      console.warn(
        'react-native-pdf-renderer: An error occurred while rendering the PDF.',
        event.nativeEvent
      );
      return;
    }
    onError?.();
  }, [onError]);

  const params: NativeParams = useMemo(
    () => ({
      source,
      singlePage,
      maxZoom,
    }),
    [source, singlePage, maxZoom],
  );

  return (
    <PdfRendererNative
      ref={nativeRef}
      testID={testID}
      maxPageResolution={maxPageResolution}
      distanceBetweenPages={distanceBetweenPages}
      style={viewStyles}
      params={params}
      onPageChange={handlePageChange}
      onScaleChange={handleScaleChange}
      onError={handleError}
      // old architecture events for iOS, because iOS require unique names
      // @ts-ignore
      onRnPdfPageChange={handlePageChange}
      onRnPdfError={handleError}
    />
  );
};

export default forwardRef(PdfRendererView);
