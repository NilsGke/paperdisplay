mkdir temp
curl -L "https://github.com/NilsGke/paperdisplay/releases/latest/download/dist.tar.gz" -o temp/dist.tar.gz
tar -xzf temp/dist.tar.gz -C temp
rsync -av --exclude "__pycache__" --exclude "venv/" temp/dist/ ./
rm -r temp