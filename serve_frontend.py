import http.server
import socketserver
import os
import sys

PORT = 3000
BUILD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src', 'frontend', 'diet-assistant-ui', 'build')

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BUILD_DIR, **kwargs)

    def do_GET(self):
        # Translate requested path to filesystem path
        path = self.translate_path(self.path)
        # If file doesn't exist and doesn't look like a static asset, fallback to index.html (SPA routing)
        if not os.path.exists(path) and not '.' in os.path.basename(self.path):
            self.path = '/index.html'
        return super().do_GET()

    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

if __name__ == '__main__':
    if not os.path.exists(BUILD_DIR):
        print(f"Build directory not found at {BUILD_DIR}")
        sys.exit(1)
    
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"Serving NutriGen AI Frontend at http://localhost:{PORT}")
        print(f"Static directory: {BUILD_DIR}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.server_close()
