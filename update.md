# Indepth update guide

To update the software in production, follow these steps:

## 1. ssh into the raspberry pi

```bash
ssh [username]@[hostname].local
# examples:
# ssh pi@raspberrypi.local
# ssh admin@paperdisplay.local
```

## 2. locate and move into the paperdisplay directory

This directory is normally inside your home directory (`~/paperdisplay`)

```bash
cd ~/paperdisplay
```

## 3. Stop the server

Run the following script to stop the server, that is running in the background:

```bash
./stop.sh
```

**(IF YOU HAVE NO PERMISSION, RUN `chmod +x ./stop.sh` and try again)**

## 4. Run the update script

```bash
./update.sh
```

This might take some time, since it might install new dependencies for the server

**(IF YOU HAVE NO PERMISSION, RUN `chmod +x ./upate.sh` and try again)**

## 5. Start the server

```bash
./start.sh
```

---

If everything went well, the new server should be up on your local network.

You can now quit the ssh session with `exit`
