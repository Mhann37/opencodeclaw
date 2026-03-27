#!/bin/bash

# OLLAMA SETUP FOR RASPBERRY PI 5
# Installs Ollama + orca-mini model (3GB, optimized for 4GB RAM)

set -e

echo "=================================================="
echo "Ollama Setup for Raspberry Pi 5 (4GB RAM)"
echo "=================================================="

# Check if already installed
if command -v ollama &> /dev/null; then
    echo "✓ Ollama already installed"
    OLLAMA_INSTALLED=true
else
    echo "Installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
    OLLAMA_INSTALLED=true
fi

# Create ollama directory
mkdir -p ~/.ollama
mkdir -p ~/.ollama/models

echo ""
echo "Pulling orca-mini-7b (3GB - optimized for Pi 5)..."
echo "This may take 5-10 minutes on first run..."
echo ""

# Pull model
ollama pull orca-mini

# Verify
echo ""
echo "Verifying installation..."
ollama list

echo ""
echo "=================================================="
echo "✓ Ollama setup complete!"
echo "=================================================="
echo ""
echo "To start Ollama server:"
echo "  ollama serve"
echo ""
echo "Then test with:"
echo "  curl http://localhost:11434/api/generate -d '{\"model\":\"orca-mini\",\"prompt\":\"Hello\",\"stream\":false}'"
echo ""
echo "Model info:"
echo "  Size: ~3GB"
echo "  RAM: ~3GB active"
echo "  Inference time: 5-15s per task (acceptable for Pi 5)"
echo ""
