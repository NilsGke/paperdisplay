set -e # exit when any command fails
mkdir temp

echo "downloading new release"
curl -L "https://github.com/NilsGke/paperdisplay/releases/latest/download/dist.tar.gz" -o temp/dist.tar.gz

echo "unpacking new release"
tar -xzf temp/dist.tar.gz -C temp

echo "copying new files"
rsync -av --exclude "__pycache__" --exclude "venv/" temp/dist/ ./

echo "cleaning up"
rm -r temp

echo "reinstalling new server dependencies"
cd server
source venv/bin/activate
pip3 install -r requirements.txt
deactivate
cd ..

echo "\n\nfinished!"