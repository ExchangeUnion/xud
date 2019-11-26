#!/bin/bash
set -ex
source .env

echo "raiden Bob:"
cat "$TEMP_PATH/raiden-bob/raiden.log"
echo "raiden Alice:"
cat "$TEMP_PATH/raiden-alice/raiden.log"
echo "xud:"
cat $TEMP_PATH/logs/*.log > "$TEMP_PATH/xud.log"
cat "$TEMP_PATH/xud.log"
