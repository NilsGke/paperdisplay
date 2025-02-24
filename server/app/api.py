import os
import subprocess
from flask import Blueprint, jsonify, make_response, request, send_from_directory
from werkzeug.utils import secure_filename

api = Blueprint("api", __name__)

# First try the development path (../images)
dev_images_path = os.path.join(os.getcwd(), "../images")
# Fallback to production path (../../images)
prod_images_path = os.path.join(os.getcwd(), "../../images")

# Check if development path exists, otherwise use production path
if os.path.exists(dev_images_path) and os.path.isdir(dev_images_path):
    IMAGES_DIR = dev_images_path
    print(f"Using development images directory: {IMAGES_DIR}")
else:
    IMAGES_DIR = prod_images_path
    print(f"Using production images directory: {IMAGES_DIR}")

DRAW_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "../../display/paint.py")
ALLOWED_EXTENSIONS = ["bmp"]
LOG_FILE = os.path.join(os.getcwd(), "../log.txt")

VERSION_FILE = os.path.join(os.getcwd(), "../version.txt")
f = open(VERSION_FILE)
VERSION = f.read()
f.close()

# Store the currently displayed image name
CURRENT_IMAGE = None

print(os.getcwd())

@api.route('/images', methods=["GET"])
def get_filenames():
    try:
        images = os.listdir(IMAGES_DIR)
        return jsonify(images), 200
    except FileNotFoundError:
        return jsonify({"error": "Images directory not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route("/images/<filename>", methods=["GET"])
def get_image(filename):
    try:
        # Check if the file exists in the directory
        if filename not in os.listdir(IMAGES_DIR):
            return "Image not found", 404
        
        # Serve the file
        return send_from_directory(IMAGES_DIR, filename)
    except Exception as e:
        return f"Error serving the image: {e}", 500


@api.route("/setImage/<filename>", methods=["POST"])
def set_image(filename):
    global CURRENT_IMAGE
    try:
        # Check if the file exists in the directory
        if filename not in os.listdir(IMAGES_DIR):
            return "Image not found", 404
        
        try:
            # Call the external Python script
            result = subprocess.run(
                ['python3', DRAW_SCRIPT_PATH, '--bmpfile', filename],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Save the current image name
            CURRENT_IMAGE = filename

            # Return the output from the external script
            return jsonify({'message': 'Image drawn successfully', 'output': result.stdout}), 200
        except subprocess.CalledProcessError as e:
            # Handle errors from the external script
            return jsonify({'error': 'Error drawing image', 'details': e.stderr}), 500
        
    except Exception as e:
        print(e)
        return e, 400


@api.route("/addImage", methods=["POST"])       
def upload_image():
    if 'file' not in request.files:
        return "you did not provide a file", 400
    
    file = request.files['file']
    
    if file.filename == '':
        return "you did not provide a file", 400

    if not (file or allowed_file(file.filename)):
        return "the provided file extension is not allowed"
        
    filename = secure_filename(file.filename)
    
    if filename == "temp.bmp":
        return "filename not allowed", 400
        
    print(os.listdir(IMAGES_DIR))
        
    if filename in os.listdir(IMAGES_DIR):
        return "filename already exists", 400
    
    file.save(os.path.join(IMAGES_DIR, filename))
    return jsonify(success=True)


@api.route("removeImage/<filename>", methods=["POST"])
def remove_image(filename):
    filename = secure_filename(filename)
    
    if filename not in os.listdir(IMAGES_DIR):
        return "Image not found", 404
    
    os.remove(os.path.join(IMAGES_DIR, filename))
    
    return make_response("ok", 200)


@api.route("/currentImage", methods=["GET"])
def get_current_image():
    if CURRENT_IMAGE:
        return CURRENT_IMAGE, 200
    else:
        return "", 204  # No Content status code


@api.route("/previewImage", methods=["POST"])
def preview_image():
    global CURRENT_IMAGE
    if 'file' not in request.files:
        return "you did not provide a file", 400
    
    file = request.files['file']
    
    if file.filename == '':
        return "you did not provide a file", 400
    
    file.save(os.path.join(IMAGES_DIR, "temp.bmp"))
    set_image("temp.bmp")
    os.remove(os.path.join(IMAGES_DIR, "temp.bmp"))
    
    # Reset current image since we're just previewing
    CURRENT_IMAGE = None
    
    return jsonify(success=True)
        

@api.route("/logs", methods=["GET"])
def get_logs():
    file = open(LOG_FILE, "r")
    content = file.read()
    file.close()
    response = make_response(content, 200)
    response.mimetype = "text/plain"
    return response


@api.route("/version", methods=["GET"])
def get_version():
    response = make_response(VERSION, 200)
    response.mimetype = "text/plain"
    return response


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS