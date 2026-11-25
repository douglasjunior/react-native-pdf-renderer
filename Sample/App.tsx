import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PdfRendererView from 'react-native-pdf-renderer';
import { File, Paths } from 'expo-file-system';
// import ReactNativeBlobUtil from 'react-native-blob-util';

const PDF_URL =
  'https://github.com/douglasjunior/react-native-pdf-renderer/raw/refs/heads/main/Sample/A17_FlightPlan.pdf'; // 618 pages
// const PDF_URL = 'https://github.com/ArturT/Test-PDF-Files/raw/refs/heads/master/not_encrypted.pdf'; // 1 pages
// const PDF_URL = 'https://github.com/ArturT/Test-PDF-Files/raw/refs/heads/master/corrupted.pdf'; // corrupted

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdfWrapper: {
    flex: 1,
  },
  pdf: {
    margin: 24,
    backgroundColor: 'transparent',
  },
  pageIndicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pageIndicatorText: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    color: 'black',
    padding: 4,
    borderRadius: 4,
  },
});

const PdfView = ({ source }: { source: string }) => {
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [singlePage, setSinglePage] = useState(false);
  const [scale, setScale] = useState(1);

  const dim = Math.min((scale - 1) / 2, 1);

  return (
    <View
      style={[
        styles.pdfWrapper,
        { backgroundColor: `rgba(0, 0, 0, ${0.85 * dim})` },
      ]}>
      <Button
        title="Single Page"
        onPress={() => setSinglePage(prev => !prev)}
      />
      <PdfRendererView
        style={styles.pdf}
        source={source}
        distanceBetweenPages={16}
        maxZoom={20}
        maxPageResolution={2048}
        singlePage={singlePage}
        onPageChange={(current, total) => {
          console.log('onPageChange', { current, total });
          setCurrentPage(current);
          setTotalPages(total);
        }}
        onScaleChange={newScale => {
          console.log('onScaleChange', { scale: newScale });
          setScale(newScale);
        }}
        onError={() => {
          console.warn('Error loading PDF');
          Alert.alert('Error', 'Error loading PDF');
        }}
      />
      <View style={styles.pageIndicatorContainer}>
        <Text style={styles.pageIndicatorText}>
          {currentPage + 1}/{totalPages} · {scale.toFixed(1)}x
        </Text>
      </View>
    </View>
  );
};

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [downloading, setDownloading] = useState(false);

  const [toggle, setToggle] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [source, setSource] = useState<string>();

  const downloadWithExpoFileSystem = useCallback(async () => {
    try {
      setDownloading(true);
      /**
       * Download the PDF file with any other library, like "expo-file-system", "rn-fetch-blob" or "react-native-blob-util"
       */
      const destination = new File(Paths.document, 'file.pdf');
      const downloadedFile = await File.downloadFileAsync(PDF_URL, destination, {
        idempotent: true,
      });
      /*
       * Then, set the local file URI to state and pass to the PdfRendererView source prop.
       */
      setSource(downloadedFile.uri);
    } catch (err) {
      console.warn(err);
    } finally {
      setDownloading(false);
    }
  }, []);

  // const downloadWithBlobUtil = useCallback(async () => {
  //   try {
  //     setDownloading(true);
  //     /**
  //      * Download the PDF file with any other library, like "expo-file-system", "rn-fetch-blob" or "react-native-blob-util"
  //      */
  //     const dirs = ReactNativeBlobUtil.fs.dirs;
  //     const response = await ReactNativeBlobUtil.config({
  //       path: dirs.DocumentDir + '/file.pdf',
  //     }).fetch('GET', PDF_URL);
  //     /*
  //      * Then, set the local file URI to state and pass to the PdfRendererView source prop.
  //      */
  //     setSource(response.path());
  //   } catch (err) {
  //     console.warn(err);
  //   } finally {
  //     setDownloading(false);
  //   }
  // }, []);

  useEffect(() => {
    downloadWithExpoFileSystem();
    // downloadWithBlobUtil();
  }, [downloadWithExpoFileSystem]);

  const renderPdfView = () => {
    if (downloading || !source) {
      return <Text>Downloading...</Text>;
    }

    return <PdfView source={source} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Mount/Unmount" onPress={() => setToggle(prev => !prev)} />
      <Button title="Show modal" onPress={() => setModalVisible(true)} />

      {toggle ? renderPdfView() : <Text>Unmounted</Text>}

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        navigationBarTranslucent={false}
        statusBarTranslucent={false}>
        <SafeAreaView style={styles.container}>
          <Button title="Close modal" onPress={() => setModalVisible(false)} />
          {renderPdfView()}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

export default App;
