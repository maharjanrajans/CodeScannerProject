/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [isScanned, setIsScanned] = React.useState(false);

  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes(
    [BarcodeFormat.ALL_FORMATS],
    {checkInverted: true},
  );

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  React.useEffect(() => {
    console.log(barcodes);
  }, [barcodes]);

  React.useEffect(() => {
    toggleActiveState();
    return () => {
      barcodes;
    };
  }, [barcodes]);

  const toggleActiveState = async () => {
    if (barcodes) {
      setTimeout(() => {
        setIsScanned(true);
      }, 3000);
    }
  };

  return (
    device != null &&
    hasPermission && (
      <SafeAreaView style={styles.mainConatiner}>
        <View style={styles.cameraContainer}>
          <Camera
            style={StyleSheet.absoluteFillObject}
            device={device}
            // isActive={true}
            isActive={!isScanned}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
        </View>
        <Button title="Rescan" onPress={() => setIsScanned(false)} />
        <ScrollView style={styles.scannedTextContent}>
          <Text>Scanned Codes:</Text>
          {barcodes.map((barcode, idx) => (
            <Text key={idx} style={styles.barcodeTextURL}>
              {barcode.displayValue}
            </Text>
          ))}
        </ScrollView>
      </SafeAreaView>
    )
  );
}

const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
  },
  barcodeTextURL: {
    fontSize: 20,
    // color: 'red',
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
  },
  scannedTextContent: {
    flex: 1,
    margin: 10,
  },
});
