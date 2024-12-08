version=$(jq -r '.version' manifest.json)
mkdir -p ./releases/$version
zip -r ./releases/$version/extension.zip dist assets manifest.json package.json
