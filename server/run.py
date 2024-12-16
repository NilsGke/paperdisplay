import os
# from dotenv import load_dotenv
from app import create_app
from app.api import api
from app.static import static


# Load environment variables
# Try same directory first
local_env_path = os.path.join(os.path.dirname(__file__), ".env.production")
parent_env_path = os.path.join(os.path.dirname(__file__), "../", ".env.production")

# if os.path.exists(local_env_path):
#     load_dotenv(dotenv_path=local_env_path)
# elif os.path.exists(parent_env_path):
#     load_dotenv(dotenv_path=parent_env_path)
# else:
#     raise FileNotFoundError("No .env file found in expected locations.")

app = create_app()

# Register blueprint
app.register_blueprint(api, url_prefix="/api")
app.register_blueprint(static, url_prefix="")

if __name__ == "__main__":
    # host = os.getenv("VITE_HOST", "127.0.0.1")
    # port = int(os.getenv("VITE_PORT", 80))
    host = "paperdisplay.local"
    port = 80
    app.run(host=host, port=port)
    
    
