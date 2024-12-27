# download and unpack release
mkdir paperdisplay
mkdir images
cd paperdisplay

echo ">downloading latest release"
curl -L "https://github.com/NilsGke/paperdisplay/releases/latest/download/dist.tar.gz" -o dist.tar.gz # download

echo ">unpacking latest release"
tar -xzf dist.tar.gz # unpack

echo ">cleaning up"
mv -v dist/* ./ # move project to current directory
rm -r dist dist.tar.gz # cleanup


# install dependencies for display
echo ">installing global python dependencies"
sudo apt update
sudo apt install libjpeg-dev zlib1g-dev
sudo apt-get install python3-pil
sudo apt install python3-gpiozero
pip3 install pigpio
pip3 install spidev
pip3 install gpiozero
echo ">finished installing global dependencies"

# setup python server
echo ">installing python server dependencies"
cd server
python3 -m venv venv # create python virtual env
source venv/bin/activate # activate venv
pip3 install -r requirements.txt # install dependencies
deactivate # deactivate venv
cd ..

echo ">finished!"
echo "to run the project, execute the `./start.sh` script"