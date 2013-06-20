#!/bin/sh

BASEDIR=$(dirname $0)
cd $BASEDIR

java -jar plovr.jar build config.js > ../public/assets/static/js/hlc-compiled.js