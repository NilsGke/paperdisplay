import os
from flask import Blueprint, jsonify, abort, send_from_directory

from app.drawImage import drawImageToPD

api = Blueprint("api", __name__)

IMAGES_DIR = os.path.join(os.getcwd(), "../images")

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
        for filename in os.listdir(IMAGES_DIR):
            print(filename)
        # Check if the file exists in the directory
        if filename not in os.listdir(IMAGES_DIR):
            abort(404, description="Image not found")
        
        # Serve the file
        return send_from_directory(IMAGES_DIR, filename)
    except Exception as e:
        abort(500, description=f"Error serving the image: {e}")


@api.route("/setImage/<filename>", methods=["GET"])
def set_image(filename):
    try:
        # Check if the file exists in the directory
        if filename not in os.listdir(IMAGES_DIR):
            abort(404, description="Image not found")
        
        return drawImageToPD(IMAGES_DIR + "/" + filename)
    except Exception as e:
        abort(500, description=f"Error serving the image: {e}")