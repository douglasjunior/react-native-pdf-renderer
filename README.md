# React-Native Pdf Renderer

[![License MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](https://github.com/douglasjunior/react-native-pdf-renderer/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/react-native-pdf-renderer.svg)](https://www.npmjs.com/package/react-native-pdf-renderer?activeTab=versions)
[![npm downloads](https://img.shields.io/npm/dt/react-native-pdf-renderer.svg)](https://www.npmjs.com/package/react-native-pdf-renderer)

⚛ A zoomable, blazing fast, zero dependencies, pure native, typed PDF Renderer for Android and iOS.

It uses [PdfRenderer](https://developer.android.com/reference/android/graphics/pdf/PdfRenderer) for Android and [PdfKit](https://developer.apple.com/documentation/pdfkit) for iOS.

|Android|iOS|
|-|-|
|<img src="https://github.com/douglasjunior/react-native-pdf-renderer/raw/main/screenshots/android.gif" width="240"/>|<img src="https://github.com/douglasjunior/react-native-pdf-renderer/raw/main/screenshots/ios.gif" width="240"/>

## Requirements

- React Native >= 0.60.0
- iOS >= 11.0
- Android >= API 19

## Install

Install dependency package
```bash
yarn add react-native-pdf-renderer
```
Or
```bash
npm i -S react-native-pdf-renderer
```

Go to the folder **your-project/ios** and run `pod install`, and you're done. 

## Basic usage

There is only one component that you need to use to render the PDF file.

```jsx
import PdfRendererView from 'react-native-pdf-renderer';

const App = () => {
   return (
      <SafeAreaView style={{flex: 1}}>
         <PdfRendererView
            style={{backgroundColor: 'red'}}
            source="file:///path/to/local/file.pdf"
            distanceBetweenPages={16}
            maxZoom={5}
            onPageChange={(current, total) => {
               console.log(current, total);
            }}
         />
      </SafeAreaView>
   );
}

export default App;
```

The `source` prop must point to a file stored inside device memory. 

If the file is online, you can use some third part library like `expo-file-system`, `rn-fetch-blob` or `react-native-blob-util` to download and save locally.

For more details, see the [Sample Project](https://github.com/douglasjunior/react-native-pdf-renderer/blob/master/Sample/App.tsx).

## PdfRendererView props

Inherits [View Props](https://reactnative.dev/docs/view#props).

|Name|Value|Default|Description|
|-|-|-|-|
|source|`string`||Path to a file stored on device.|
|distanceBetweenPages|`number`|`16`|Distance in `DPI` between pages.|
|maxZoom|`number`|`5`|Max zoom scale.|
|singlePage|`boolean`|`false`|(Experimental) Renders only the first page without scroll. (useful for display thumbnail)|
|onPageChange|`(current: number, total: number) => void`||Invoked on pages scroll.|

## Limitations

### Size measuring

The `PdfRendererView` is `flex: 1` by default, so you need to make sure that your parents `View` are `flex: 1` or have a fixed `width/height`.

### Border radius

The `borderRadius` style is ignored by React Native custom view in Android and crash on iOS. (read more #1)

If you need `borderRadius`, the best option is to wrap the `PdfRendererView` in another `View`.

```jsx
<View style={{ flex: 1, borderRadius: 24, overflow: 'hidden' }}>
   <PdfRendererView
      // ...
   />
</View>
```

## Contribute

New features, bug fixes and improvements are welcome! For questions and suggestions use the [issues](https://github.com/douglasjunior/react-native-pdf-renderer/issues).

<a href="https://www.patreon.com/douglasjunior"><img src="http://i.imgur.com/xEO164Z.png" alt="Become a Patron!" width="200" /></a>
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://paypal.me/douglasnassif)

## Thanks to

This lib is only possible thanks to the community help:

- RecyclerView `notifyDataSetChanged()` not working on React Native: https://stackoverflow.com/a/49381907/2826279
- Add pinch to zoom on RecyclerView: https://stackoverflow.com/a/37895783/2826279
- Using `Matrix` to handle zoom in a View: https://stackoverflow.com/a/55299327/2826279
- Daniel Felipe Sartório for the help with Android native

## License

```
The MIT License (MIT)

Copyright (c) 2023 Douglas Nassif Roma Junior
```

See the full [license file](https://github.com/douglasjunior/react-native-pdf-renderer/blob/master/LICENSE).
