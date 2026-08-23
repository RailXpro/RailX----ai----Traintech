"""
Root entry point for RailX AI Block Planning Application Server
"""

import os
import sys
import uvicorn

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

from backend.main import app

if __name__ == "__main__":
    print("==================================================================")
    print("   RAILX AI - INDIAN RAILWAYS AUTOMATIC BLOCK PLANNING HUB        ")
    print("   Server running at: http://127.0.0.1:8000                        ")
    print("==================================================================")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
