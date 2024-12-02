#!/usr/bin/python
import os
import sys
from PIL import Image,ImageDraw

# TODO: REPLACE PIL WITH PILLOW

def drawImageToPD(path: str):
  from lib.waveshare_epd import epd7in5_V2
  

  if not os.path.exists(path):
    sys.stderr.write(f"error: {path} does not exist")
    exit()

  try:
    epd = epd7in5_V2.EPD()

    epd.init()
    epd.Clear()

    IMG = Image.new("1", (epd.width, epd.height), 255)
    draw = ImageDraw.Draw(IMG)

    bmp = Image.open(path)

    IMG.paste(bmp, (0, 0))

    epd.display(epd.getbuffer(IMG))
    epd.sleep()

  except IOError as e:
    print(f"error \n {e}")
    return False

  return True