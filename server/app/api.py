import os
import subprocess
from flask import Blueprint, jsonify, abort, make_response, request, send_from_directory
from werkzeug.utils import secure_filename

api = Blueprint("api", __name__)

IMAGES_DIR = os.path.join(os.getcwd(), "../../images")
DRAW_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "../../display/paint.py")
ALLOWED_EXTENSIONS = ["bmp"]
LOG_FILE = os.path.join(os.getcwd(), "../log.txt")

VERSION_FILE = os.path.join(os.getcwd(), "../version.txt")
f = open(VERSION_FILE)
VERSION = f.read()
f.close()

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
            abort(404, description="Image not found")
        
        # Serve the file
        return send_from_directory(IMAGES_DIR, filename)
    except Exception as e:
        abort(500, description=f"Error serving the image: {e}")


@api.route("/setImage/<filename>", methods=["POST"])
def set_image(filename):

    try:
        # Check if the file exists in the directory
        if filename not in os.listdir(IMAGES_DIR):
            abort(404, description="Image not found")
        
        
        try:
            # Call the external Python script
            result = subprocess.run(
                ['python3', DRAW_SCRIPT_PATH, '--bmpfile', filename],
                capture_output=True,
                text=True,
                check=True
            )

            # Return the output from the external script
            return jsonify({'message': 'Image drawn successfully', 'output': result.stdout}), 200
        except subprocess.CalledProcessError as e:
            # Handle errors from the external script
            return jsonify({'error': 'Error drawing image', 'details': e.stderr}), 500
        
    except Exception as e:
        print(e)
        abort(500, description=e)
       
        
@api.route("/addImage", methods=["POST"])       
def upload_image():
    if 'file' not in request.files:
        abort(400, description="you did not provide a file")
        return
    
    file = request.files['file']
    
    if file.filename == '':
        abort(400, description="you did not provide a file")
        return

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        
        if filename == "temp.bmp":
            abort(400, description="filename not allowed")
            
        # TODO: check if file with that name exists
        
        file.save(os.path.join(IMAGES_DIR, filename))
        return jsonify(success=True)
      

@api.route("/previewImage", methods=["POST"])
def preview_image():
    if 'file' not in request.files:
        abort(400, description="you did not provide a file")
        return
    
    file = request.files['file']
    
    if file.filename == '':
        abort(400, description="you did not provide a file")
        return
    
    file.save(os.path.join(IMAGES_DIR, "temp.bmp"))
    set_image("temp.bmp")
    os.remove(os.path.join(IMAGES_DIR, "temp.bmp"))
    
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