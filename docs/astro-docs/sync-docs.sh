#!/bin/bash
# Sync markdown files from parent docs directory to src/content

echo "Syncing documentation files..."
cp ../../*.md src/content/
echo "✓ Documentation files synced successfully!"
