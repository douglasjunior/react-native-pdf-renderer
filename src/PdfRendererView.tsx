import React, {useCallback} from 'react';
import {
  NativeSyntheticEvent,
  requireNativeComponent,
  ViewProps,
} from 'react-native';

export type PdfRendererViewPropsType = ViewProps & {
  source?: string;
  distanceBetweenPages: number;
  maxZoom: number;
  onPageChange?: (page: number, totalPages: number) => void;
};

type OnPageChangeEventType = {
  position: number;
  total: number;
};

const PdfRendererNative = requireNativeComponent('RNPdfRendererView') as any;

const PdfRendererView = ({
  onPageChange,
  ...others
}: PdfRendererViewPropsType): JSX.Element => {
  const handlePageChange = useCallback(
    (event: NativeSyntheticEvent<OnPageChangeEventType>) => {
      onPageChange?.(event.nativeEvent.position, event.nativeEvent.total);
    },
    [onPageChange],
  );

  return <PdfRendererNative {...others} onPageChange={handlePageChange} />;
};

PdfRendererView.defaultProps = {
  maxZoom: 5,
  distanceBetweenPages: 16,
};

export default PdfRendererView;
