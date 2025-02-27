import os
from typing import List
from flask import Blueprint, jsonify, make_response, request, send_from_directory
from werkzeug.utils import secure_filename
from app.config import IMAGES_DIR, CURRENT_IMAGE
from app.display import set_image
from app.scheduledImages import get_schedules, remove_schedule, schedule_image, edit_schedule

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
def set_image_endpoint(filename):
    global CURRENT_IMAGE
    response, status_code = set_image(filename)
    if status_code == 200:
        CURRENT_IMAGE = filename
    return jsonify(response), status_code


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


@api.route("/addSchedule", methods=["POST"])
def add_schedule_endpoint():
    body = request.get_json()
    hour: str = body['hour']
    minute: str = body['minute']
    image_name: str = body['imageName']
    days: List[bool] = body['days']
    
    if(hour == None or minute == None or image_name == None or days == None or len(days) != 7):
        return "invalid parameters", 400
    
    
    schedule_image(hour, minute, image_name, days)
    return "", 200

@api.route("/getSchedules", methods=["GET"])
def get_schedules_endpoint():
    schedules = get_schedules()
    
    return jsonify(schedules), 200
    

@api.route("/removeSchedule", methods=["POST"])
def remove_schedule_endpoint():
    id: str = request.data.decode()
    if id == None: 
        return "No schedule id found", 400
    
    try:
        remove_schedule(id)
    except:
        return "schedule not found (or other error)", 400
    
    return "ok", 200

@api.route("/editSchedule", methods=["POST"])
def edit_scheduled_endpoint():
    body = request.get_json()
    job_id: str = body["id"]
    hour: str = body['hour']
    minute: str = body['minute']
    image_name: str = body['imageName']
    days: List[bool] = body['days']
    
    if(job_id == None or hour == None or minute == None or image_name == None or days == None or len(days) != 7):
        return "invalid parameters", 400

    edit_schedule(job_id, hour, minute, image_name, days)
    
    return "", 200
    
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS