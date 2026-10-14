#!/bin/zsh
set -euo pipefail

LAUNCHER_ROOT="$(cd "$(dirname "$0")" && pwd)"
APP_PATH="$LAUNCHER_ROOT/build/ECEn 224 Terminal.app"

mkdir -p "$APP_PATH/Contents/MacOS"
cp "$LAUNCHER_ROOT/Info.plist" "$APP_PATH/Contents/Info.plist"
xcrun swiftc -parse-as-library "$LAUNCHER_ROOT/main.swift" -framework Cocoa -o "$APP_PATH/Contents/MacOS/ECEn224Terminal"

echo "Built: $APP_PATH"
echo "Open it once to register the ecen224-terminal:// button."
