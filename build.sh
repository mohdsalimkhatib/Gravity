#!/bin/bash
set -e

echo "================================"
echo "Building Journey Application"
echo "================================"

# Build backend
echo "📦 Building backend..."
cd backend
mvn clean package -DskipTests -X

echo "✅ Build complete!"
echo "JAR file created at: target/learning-0.0.1-SNAPSHOT.jar"
