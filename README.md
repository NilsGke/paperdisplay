# paperdisplay

Homepage             |  Quicktext 
:-------------------------:|:-------------------------:
<img width="1920" alt="image" src="https://github.com/user-attachments/assets/529b33dd-21ad-4113-8910-cbea08240c2a" /> |  <img width="1920" alt="image" src="https://github.com/user-attachments/assets/c960b853-a9ea-49d3-b25c-b59512c8058f" /> 
Schedules | 3d printed Frame
<img width="1920" alt="image" src="https://github.com/user-attachments/assets/e57cf44e-d2a4-4858-8cbd-28665d3f60a6" /> | ![paperdisplay-gh](https://github.com/user-attachments/assets/c0117329-2d64-44b1-a6ff-58edb9cf613a)






## how does it work

This projects consists of three parts:

### Server

The server is a python project with a venv. in prod it serves the api and the frontend both via http

### Display controller

There is a small script that controls the display. It can be run via python and passed args like: `--bmpfile hello.bmp` to render a bitmap

### Frontend

The frontend is a React + TypeScript + Vite project.

### how does it all work togehter

the script `buildProd.sh` builds the frontend, copies it, the server and the display directories to dist and copies everything from the misc directory to the root of the dist folder.

## raspberrypi (on raspberry pi)

### Install Script

Run this command in the root of your pi. It will create two folders, `/images` and `/paperdisplay`.

```bash
curl -fsSL https://raw.githubusercontent.com/NilsGke/paperdisplay/refs/heads/main/misc/install.sh | bash
```

### manual installation

#### 1. Download and install project and dependencies

```bash
# download and unpack release
mkdir paperdisplay
mkdir images
cd paperdisplay
curl -L "https://github.com/NilsGke/paperdisplay/releases/latest/download/dist.tar.gz" -o dist.tar.gz # download
tar -xzf dist.tar.gz # unpack
mv -v dist/* ./ # move project to current directory
rm -r dist dist.tar.gz # cleanup

# install dependencies for display
sudo apt update
sudo apt install libjpeg-dev zlib1g-dev
sudo apt-get install python3-pil
sudo apt install python3-gpiozero
pip3 install pigpio
pip3 install spidev
pip3 install gpiozero
# (TODO: CHECK IF ALL OF THEM ARE RELEVANT)

# install screen to be ablet to run server process in background
sudo apt-get install screen


# setup python server
cd server
python3 -m venv venv # create python virtual env
source venv/bin/activate # activate venv
pip3 install -r requirements.txt # install dependencies
deactivate # deactivate venv
cd ..
```

#### 2. Enable SPI

Open the Raspberry Pi configuration tool:

```bash
sudo raspi-config
```

Navigate to Interface Options → SPI and enable it.
Reboot your Raspberry Pi to apply the changes:

```bash
sudo reboot
```

## Run the Project

To start the server just run the `./start.sh` file in the root of the project.

```bash
./start.sh
```

This will run the server in the background.  
You can attatch to the process by running:

```bash
screen -r paperdisplay-server
```

You might need to update the permissions when you are trying to run the start script

```bash
chmod +x ./start.sh
```

## Update

If there is a new version available, the frontend will show a banner on the start page.
To update the project, first stop the server and run the `./update.sh` shell script.

```bash
./stop.sh
./update.sh
```

You might need to update the permissions.

```bash
chmod +x ./stop.sh
chmod +x ./update.sh
```

## development

```bash
# clone repository
git clone https://github.com/NilsGke/paperdisplay.git
cd paperdisplay

# setup frontend
cd fronend
bun i
cd ..

# setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
```
