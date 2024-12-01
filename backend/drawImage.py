#!/usr/bin/python
import os
import sys
from lib.waveshare_epd import epd7in5_V2
from PIL import Image,ImageDraw

file_path = "./.img/image.bmp"

if not os.path.exists(file_path):
  sys.stderr.write(f"error: {file_path} does not exist")
  exit()

try:
  epd = epd7in5_V2.EPD()

  epd.init()
  epd.Clear()

  IMG = Image.new("1", (epd.width, epd.height), 255)
  draw = ImageDraw.Draw(IMG)

  bmp = Image.open(file_path)

  IMG.paste(bmp, (0, 0))

  epd.display(epd.getbuffer(IMG))
  epd.sleep()

except IOError as e:
  sys.stderr.write(f"error \n {e}")

sys.stdout.write("done")