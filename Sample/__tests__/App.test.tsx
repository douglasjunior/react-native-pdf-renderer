/**
 * @format
 */

import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-pdf-renderer', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: props.testID, style: props.style }),
  };
});

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('expo-file-system', () => ({
  Paths: {
    document: 'file:///mock-documents/',
  },
  File: class {
    static downloadFileAsync = jest
      .fn()
      .mockResolvedValue({ uri: 'file:///mock-documents/file.pdf' });
  },
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
