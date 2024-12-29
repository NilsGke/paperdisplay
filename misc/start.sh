#!/bin/bash

SESSION_NAME="paperdisplay-server"

cd server

# Check if the session is already running
if screen -list | grep -q "\.${SESSION_NAME}"; then
  echo "Session '${SESSION_NAME}' is already running."
  echo "Attatch to session with: \"screen -r ${SESSION_NAME}\""
else
  echo "Starting a new session '${SESSION_NAME}'..."
  # Start a new detached session with the command
  screen -dmL -Logfile ../log.txt -S "${SESSION_NAME}" bash -c "sudo ./venv/bin/python ./run.py"
  echo "> session started"
fi

cd ..