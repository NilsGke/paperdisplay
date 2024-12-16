# paperdisplay

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

## installation on a raspberrypi

```bash
# TODO: add github workflow to package release and add link to download to pi

# install dependencies if not already installed
sudo apt update
sudo apt install libjpeg-dev zlib1g-dev

pip3 install -r requirements.txt
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
pip3 install -r requirements.txt # installing requirements might take a while, especially on a pi zero
```
