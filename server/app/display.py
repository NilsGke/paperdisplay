import os
import subprocess
from app.config import IMAGES_DIR, DRAW_SCRIPT_PATH, set_current_image

def set_image(filename: str) -> dict:
    try:
        # Check if the file exists in the directory
        if filename not in os.listdir(IMAGES_DIR):
            return {"error": "Image not found"}, 404
        
        try:
            # Call the external Python script
            result = subprocess.run(
                ['python3', DRAW_SCRIPT_PATH, '--bmpfile', filename],
                capture_output=True,
                text=True,
                check=True
            )
            
            set_current_image(filename)
            
            # Return the output from the external script
            return {'message': 'Image drawn successfully', 'output': result.stdout}, 200
        except subprocess.CalledProcessError as e:
            # Handle errors from the external script
            return {'error': 'Error drawing image', 'details': e.stderr}, 500
        
    except Exception as e:
        print(e)
        return {"error": str(e)}, 400