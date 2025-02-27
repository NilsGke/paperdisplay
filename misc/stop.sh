#!/bin/bash

SESSION_NAME="paperdisplay-server"

echo "> killing paperdisplay server if it is running"
screen -XS "${SESSION_NAME}" quit