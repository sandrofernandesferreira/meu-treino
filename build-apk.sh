#!/bin/bash
cd "$(dirname "$0")"

# Install Node dependencies
npm install

# Create the prebuild
npx expo prebuild --clean

# Build with Gradle
cd android

# Download Gradle wrapper if needed
if [ ! -f "gradlew" ]; then
  echo "Setting up Gradle..."
  ./gradlew --version
fi

# Build release APK
./gradlew assembleRelease

# Find and copy the APK
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
  cp "app/build/outputs/apk/release/app-release.apk" "../meutreino-release.apk"
  echo "✓ APK built successfully: meutreino-release.apk"
else
  echo "✗ APK build failed"
  exit 1
fi
