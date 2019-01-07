#!/usr/bin/env bash
set -e
set -o pipefail
SUITE='smoke'

if [ ! -z $1 ]; then
    if [ $1 == '-h' ]; then
        echo "Usage: $0 [suite, default:smoke]"
        exit 1
    else
        SUITE=$1
    fi
fi

echo "Building SPA core lib"
yarn build:core:lib
echo "-----"
echo "Building SPA app"
yarn build
echo "-----"
echo "Running end to end tests. Suite: $SUITE"
yarn e2e:ci --suite=$SUITE
echo "-----"

