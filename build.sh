#!/bin/bash

( cat head.js
  cat semver.js \
    | egrep -v '^\/\* nomin \*\/' \
    | perl -pi -e 's/debug\([^\)]+\)//g'
  cat foot.js ) > semver.browser.js

uglifyjs -m <semver.browser.js >semver.min.js
gzip --stdout -9 <semver.browser.js >semver.browser.js.gz
gzip --stdout -9 <semver.min.js >semver.min.js.gz
