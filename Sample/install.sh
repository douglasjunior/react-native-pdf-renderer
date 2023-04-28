#!/bin/bash

unameOut="$(uname -s)"

echo "$unameOut";

rm -rf ../node_modules/
rm -rf node_modules/
rm -rf ios/Pods/
yarn install
rm -rf node_modules/react-native-pdf-renderer/Sample/ 
rm -rf node_modules/react-native-pdf-renderer/.git/

if [ "$unameOut" == "Darwin" ]; then
    cd ios
    pod install
fi
