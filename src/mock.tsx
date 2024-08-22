import React from 'react';

import {View} from 'react-native';
import {PdfRendererViewPropsType} from './PdfRendererView';

const PdfRendererViewMock = (props: PdfRendererViewPropsType) => {
  return <View testID={props.testID} style={props.style} />;
};

export default PdfRendererViewMock;
