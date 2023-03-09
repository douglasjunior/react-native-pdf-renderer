#!/bin/bash

unameOut="$(uname -s)"

echo "$unameOut";

if [ "$unameOut" == "Darwin" ]; then
    cd ios
    pod install
fi
