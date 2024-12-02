import os
from dotenv import load_dotenv
from app import create_app
from app.api import api

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../", ".env"))

app = create_app()

# Register blueprint
app.register_blueprint(api, url_prefix="/api")

if __name__ == "__main__":
    host = os.getenv("VITE_HOST", "127.0.0.1")
    port = int(os.getenv("VITE_PORT", 8001))
    app.run(host=host, port=port)