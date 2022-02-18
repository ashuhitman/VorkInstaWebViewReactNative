/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState, useEffect} from 'react';

import {
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNavigationStack} from '@react-navigation/stack';

import {WebView} from 'react-native-webview';

const loadingIndicator = () => (
  <ActivityIndicator style={styles.loader} color="#0000ff" size="large" />
);

const App = ({navigation}) => {
  const webRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  // const [canGoForward, setCanGoForward] = useState(false);
  const [currentURL, setcurrentURL] = useState(
    'https://sandbox.vorkinsta.com/',
  );
  const [webViewHeight, setWebViewHeight] = useState(0);
  const [resfresh, setRefresh] = useState(false);
  const onRefresh = () => {
    setRefresh(true);
    webRef.current.reload();
    setRefresh(false);
  };

  const onMessage = event => {
    setWebViewHeight(Number(event.nativeEvent.data));
};

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  });

  const backAction = () => {
    if (canGoBack) {
      webRef.current.goBack();
    } else {
      BackHandler.exitApp();
    }
    return true;
  };
  return (

    <ScrollView
      refreshControl={
        <RefreshControl refreshing={resfresh} onRefresh={onRefresh} />
      }>
      <WebView
        ref={webRef}
        source={{uri: 'https://sandbox.vorkinsta.com/'}}
        renderLoading={loadingIndicator}
        startInLoadingState={true}
        onMessage={onMessage}
        injectedJavaScript="window.ReactNativeWebView.postMessage(Math.max(screen.height, document.body.scrollHeight));"
        style={{height: webViewHeight}}
        onNavigationStateChange={navState => {
          setCanGoBack(navState.canGoBack);
          // setCanGoForward(navState.canGoForward);
          setcurrentURL(navState.url);
        }}
      />
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
