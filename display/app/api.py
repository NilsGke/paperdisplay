import os
import subprocess
from flask import Blueprint, jsonify, abort, request, send_from_directory, Response

api = Blueprint("api", __name__)

IMAGES_DIR = os.path.join(os.getcwd(), "../images")
DRAW_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "../display/draw.py")


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

    # Define the path to the external script
    script_path = '../display/draw.py'
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
        
        
        return Response("ok", 200)
    except Exception as e:
        print(e)
        abort(500, description=e)