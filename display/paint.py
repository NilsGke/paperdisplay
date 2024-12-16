#!/usr/bin/python
# -*- coding:utf-8 -*-

import sys
import os
from lib.waveshare_epd import epd7in5_V2
from PIL import Image, ImageDraw



def drawbmp(filename):
	if(len(filename) == 0):
		print("no filename provided");
		return
	print(f"drawing: {filename}")
	epd = epd7in5_V2.EPD()
	epd.init()
	image = Image.new("1", (epd.width, epd.height), 255) # 255: clear the frame
	draw = ImageDraw.Draw(image)
	bmp = Image.open(os.path.join("../../images", filename))
	image.paste(bmp, (0, 0))
	epd.display(epd.getbuffer(image))
	epd.sleep()
	exit()



filename=None

flag=None

try:

	for arg in sys.argv:

		# detect flag contents
		if(flag != None):
			if(flag == "--bmpfile"):
				drawbmp(arg)

			# reset flag after execution
			flag = None



		# detect flags
		if(arg.startswith("--")):
			flag = arg

except IOError as e:
	epd7in5_V2.epdconfig.module_exit(cleanup=True)
	raise e
	exit()
except KeyboardInterrupt:
	epd7in5_V2.epdconfig.module_exit(cleanup=True)
	exit()

