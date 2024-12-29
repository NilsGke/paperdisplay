import os
from flask import Blueprint, abort, send_from_directory

static = Blueprint("static", __name__)

STATIC_DIR = os.path.join(os.getcwd(), "..", "frontend")

ALLOWED_EXTENSIONS = {"html", "css", "js", "svg"}

@static.route('/', defaults={'path': ''})
@static.route('/<path:path>')
def send_report(path):
    # Serve index.html if path is empty (e.g., '/')
    if path == "":
        path = "index.html"

    # Restrict access to specific file extensions
    if '.' in path and path.rsplit('.', 1)[-1] not in ALLOWED_EXTENSIONS:
        abort(403)  # Forbidden

    # Resolve the full file path
    requested_path = os.path.join(STATIC_DIR, path)

    # Ensure the resolved path is within STATIC_DIR
    if not os.path.commonpath([STATIC_DIR, requested_path]) == STATIC_DIR:
        abort(404)

    try:
        return send_from_directory(STATIC_DIR, path)
    except FileNotFoundError:
        return send_from_directory(STATIC_DIR, "index.html") # if file not found, send index (necessary to make react-router work)