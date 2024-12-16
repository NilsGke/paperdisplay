#!/bin/bash

# Define variables
FRONTEND_DIR="./frontend"
SERVER_DIR="./server"
DISPLAY_DIR="./display"
MISC_DIR="./misc"
DEPLOY_DIR="./dist"
DEPLOY_FRONTEND_DIR="$DEPLOY_DIR/frontend"
DEPLOY_SERVER_DIR="$DEPLOY_DIR/server"
DEPLOY_DISPLAY_DIR="$DEPLOY_DIR/display"
RASPBERRY_PI_USER="admingoeke"
RASPBERRY_PI_HOST="paperdisplay"
RASPBERRY_PI_PATH="/home/admingoeke/paperdisplay"

# Ensure the script stops on error
set -e

echo "Starting deployment preparation..."

# Step 1: Clean up old deployment folder
if [ -d "$DEPLOY_DIR" ]; then
  echo "Cleaning up old deployment directory..."
  rm -rf "$DEPLOY_DIR"
fi

# Step 2: Build the frontend

# ask user if they want to rebuild the frontend
read -p "do you want to rebuild the frontend (y/n)" REBUILD_FONTEND

if [[ "$REBUILD_FONTEND" =~ ^[Yy]$ ]]; then
  echo "Building frontend..."
  cd "$FRONTEND_DIR"
  bun i # Ensure dependencies are installed
  bun run build
  cd ..
fi


# Step 3: Create deployment folder structure
echo "Creating deployment directory structure..."
mkdir -p "$DEPLOY_FRONTEND_DIR"

# Step 4: Copy frontend build to deploy directory
echo "Copying frontend build files..."
cp -r "$FRONTEND_DIR/dist/" "$DEPLOY_FRONTEND_DIR"

# Step 5: Copy backend to deploy directory
echo "Copying server files..."
mkdir -p "$DEPLOY_SERVER_DIR"
rsync -a --exclude="**/__pycache__" --exclude="*.pyc" --exclude="*.pyo" --exclude=".env" --exclude="venv/" "$SERVER_DIR/" "$DEPLOY_SERVER_DIR"

# copy display files to dist
echo "Copying display files..."
mkdir -p "$DEPLOY_DISPLAY_DIR"
rsync -a --exclude="**/__pycache__" --exclude="*.pyc" --exclude="*.pyo" --exclude=".env" --exclude="venv/" --exclude '.DS_Store' "$DISPLAY_DIR/" "$DEPLOY_DISPLAY_DIR"

# copy contents of misc into root of dist folder
echo "Copying misc files..."
cp -r "$MISC_DIR/"* "$DEPLOY_DIR/"

# Step 6: Add .env.pi file to dist, because raspberrypi uses it
echo "Adding .env file..."
cp ".env.production" "$DEPLOY_DIR/.env.production"


# Step 7: Prompt to send the folder to the Raspberry Pi
read -p "Deployment folder prepared successfully at $DEPLOY_DIR. Do you want to send it to the Raspberry Pi? (y/n): " SEND_TO_PI

if [[ "$SEND_TO_PI" =~ ^[Yy]$ ]]; then
    echo "Ensuring target directory exists on Raspberry Pi..."
    ssh "$RASPBERRY_PI_USER@$RASPBERRY_PI_HOST" "mkdir -p $RASPBERRY_PI_PATH"
    echo "Sending deployment folder to Raspberry Pi..."
    rsync -avz --delete --exclude "**/__pycache__" --exclude="$SERVER_DIR/venv/" --exclude='venv/' "$DEPLOY_DIR/" "$RASPBERRY_PI_USER@$RASPBERRY_PI_HOST:$RASPBERRY_PI_PATH/"
    
    if [ $? -eq 0 ]; then
        echo "Deployment folder successfully sent to $RASPBERRY_PI_USER@$RASPBERRY_PI_HOST:$RASPBERRY_PI_PATH"
        
        read -p "Do you want to setup the virtual environment on the Raspberry Pi (y/n)? " SETUP_VENV
        
        if [[ "$SETUP_VENV" =~ ^[Yy]$ ]]; then
            # Step 8: Rebuild the virtual environment on the Raspberry Pi
            echo "Rebuilding Python virtual environment on the Raspberry Pi..."
            ssh "$RASPBERRY_PI_USER@$RASPBERRY_PI_HOST" << EOF
cd "$RASPBERRY_PI_PATH/server"
echo "activating venv"
source venv/bin/activate
echo "installing requirements"
pip install -r requirements.txt
EOF
            echo "Virtual environment successfully set up on the Raspberry Pi."
        fi
    else
        echo "Failed to send the deployment folder. Please check your Raspberry Pi connection and try again."
    fi
else
    echo "Deployment folder is ready for manual transfer at $DEPLOY_DIR."
fi

# Step 9: Completion message
echo "\e[32mScript execution completed.\e[0m"