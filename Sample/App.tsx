import React, {useCallback, useEffect, useState} from 'react';
import {Button, SafeAreaView, StatusBar, Text, View} from 'react-native';
import PdfRendererView from 'react-native-pdf-renderer';
import * as FileSystem from 'expo-file-system';

function App(): JSX.Element {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [source, setSource] = useState<string>();

  const downloadFile = useCallback(async () => {
    try {
      setDownloading(true);
      /**
       * Download the PDF file with any other library, like "rn-fetch-blob" or 'expo-file-system'
       */
      const response = await FileSystem.downloadAsync(
        'https://www.hq.nasa.gov/alsj/a17/A17_FlightPlan.pdf', // 612 pages
        // 'https://www.africau.edu/images/default/sample.pdf', // 2 pages
        FileSystem.documentDirectory + 'file.pdf',
      );
      /*
       * Then, set the local file URI to state and pass to the PdfRendererView source prop.
       */
      setSource(response.uri);
    } catch (err) {
      console.warn(err);
    } finally {
      setDownloading(false);
    }
  }, []);

  useEffect(() => {
    downloadFile();
  }, [downloadFile]);

  const renderPdfView = () => {
    if (downloading) {
      return <Text>Downloading...</Text>;
    }

    if (!toggle) {
      return <Text>Unmounted</Text>;
    }

    return (
      <>
        <PdfRendererView
          style={{flex: 1, backgroundColor: 'gray'}}
          source={source}
          distanceBetweenPages={16}
          maxZoom={2}
          onPageChange={(current, total) => {
            console.log({current, total});
            setCurrentPage(current);
            setTotalPages(total);
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}>
          <Text
            style={{
              backgroundColor: 'rgba(255,255,255,0.5)',
              color: 'black',
              padding: 4,
              borderRadius: 4,
            }}>
            {currentPage + 1}/{totalPages}
          </Text>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar translucent={false} />

      <Button title="Mount/Unmount" onPress={() => setToggle(prev => !prev)} />

      {renderPdfView()}
    </SafeAreaView>
  );
}

export default App;
