# download and unpack release
mkdir paperdisplay
mkdir images
cd paperdisplay

printf "\e[42m> downloading latest release\e[0m\n"
curl -L "https://github.com/NilsGke/paperdisplay/releases/latest/download/dist.tar.gz" -o dist.tar.gz # download

printf "\e[42m> unpacking latest release\e[0m\n"
tar -xzf dist.tar.gz # unpack

printf "\e[42m> cleaning up\e[0m\n"
mv -v dist/* ./ # move project to current directory
rm -r dist dist.tar.gz # cleanup


# install dependencies for display
printf "\e[42m> installing global python dependencies\e[0m\n"
sudo apt update
sudo apt install libjpeg-dev zlib1g-dev
sudo apt-get install python3-pil
sudo apt-get install screen
sudo apt install python3-gpiozero
pip3 install pigpio
pip3 install spidev
pip3 install gpiozero
printf "\e[42m> finished installing global dependencies\e[0m\n"

# setup python server
printf "\e[42m> installing python server dependencies\e[0m\n"
cd server
python3 -m venv venv # create python virtual env
source venv/bin/activate # activate venv
pip3 install -r requirements.txt # install dependencies
deactivate # deactivate venv
cd ..

printf "\e[42m> finished!\e[0m\n"
printf "to run the project, execute the './start.sh' script"
printf "remember to check if SPI is enabled on your raspberry pi"