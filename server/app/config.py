import os

# First try the development path (../images)
dev_images_path = os.path.join(os.getcwd(), "../images")
# Fallback to production path (../../images)
prod_images_path = os.path.join(os.getcwd(), "../../images")

# Check if development path exists, otherwise use production path
if os.path.exists(dev_images_path) and os.path.isdir(dev_images_path):
    IMAGES_DIR = dev_images_path
else:
    IMAGES_DIR = prod_images_path

DRAW_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "../../display/paint.py")

# Store the currently displayed image name
CURRENT_IMAGE = None 

def set_current_image(image_name: str):
    global CURRENT_IMAGE
    CURRENT_IMAGE = image_name
    
def get_current_image():
    global CURRENT_IMAGE
    return CURRENT_IMAGE