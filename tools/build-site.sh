#!/bin/sh
# この程度だしlerna使わなくていいだろマン

set -eux

cd `dirname $0`
cd ../
cd modules/site

yarn build
