#!/usr/bin/env python3
"""Serve the course locally and run the Game 1 C practice snippets.

Usage: python3 tools/dev-server.py [port]

This intentionally binds only to localhost.  The runner executes code that
the learner enters, so it is for this trusted, local study checkout only.
"""
import http.server
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.parse

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MAX_SOURCE = 32_000
MAX_OUTPUT = 12_000
RUN_TIMEOUT = 3


def clipped(value):
    return value[:MAX_OUTPUT] + ("\n… output truncated" if len(value) > MAX_OUTPUT else "")


def same_origin(handler):
    source = handler.headers.get("Origin") or handler.headers.get("Referer")
    if not source:
        return False
    parsed = urllib.parse.urlparse(source)
    return (parsed.scheme == "http" and parsed.hostname in ("localhost", "127.0.0.1")
            and (parsed.port or 80) == handler.server.server_address[1])


def run_c(code, mode):
    if not isinstance(code, str) or not code.strip():
        raise ValueError("code is empty")
    if len(code) > MAX_SOURCE:
        raise ValueError("code is too long (maximum 32 KB)")
    if mode not in ("run", "asm"):
        raise ValueError("mode must be run or asm")
    folder = tempfile.mkdtemp(prefix="ecen224-c-")
    try:
        source = os.path.join(folder, "practice.c")
        binary = os.path.join(folder, "practice")
        with open(source, "w", encoding="utf-8") as out:
            out.write(code)
        if mode == "asm":
            build = subprocess.run(
                ["clang", "-std=c17", "-Wall", "-Wextra", "-O0", "-S", "-masm=att", source, "-o", "-"],
                capture_output=True, text=True, timeout=10,
            )
            return {"stage": "assembly", "stdout": clipped(build.stdout), "stderr": clipped(build.stderr),
                    "exitCode": build.returncode, "timedOut": False}
        build = subprocess.run(
            ["clang", "-std=c17", "-Wall", "-Wextra", "-O0", "-g", source, "-o", binary],
            capture_output=True, text=True, timeout=10,
        )
        if build.returncode:
            return {"stage": "build", "stdout": clipped(build.stdout), "stderr": clipped(build.stderr),
                    "exitCode": build.returncode, "timedOut": False}
        try:
            result = subprocess.run([binary], cwd=folder, capture_output=True, text=True, timeout=RUN_TIMEOUT)
            return {"stage": "run", "stdout": clipped(result.stdout), "stderr": clipped(result.stderr),
                    "exitCode": result.returncode, "timedOut": False}
        except subprocess.TimeoutExpired:
            return {"stage": "run", "stdout": "", "stderr": "Timed out after 3 seconds.",
                    "exitCode": None, "timedOut": True}
    except subprocess.TimeoutExpired:
        return {"stage": "build", "stdout": "", "stderr": "Compilation timed out.",
                "exitCode": None, "timedOut": True}
    finally:
        shutil.rmtree(folder, ignore_errors=True)


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_POST(self):
        if self.path != "/api/run-c":
            self.send_error(404)
            return
        if not same_origin(self):
            self.send_error(403, "Origin/Referer did not match this local server")
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length > MAX_SOURCE + 200:
                raise ValueError("request is too large")
            body = json.loads(self.rfile.read(length))
            result = run_c(body.get("code", ""), body.get("mode", "run"))
            payload = json.dumps(result).encode()
            self.send_response(200)
        except (ValueError, json.JSONDecodeError) as error:
            payload = json.dumps({"error": str(error)}).encode()
            self.send_response(400)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8018
    with http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler) as server:
        print("ECEn 224 local study server")
        print("  open: http://127.0.0.1:%d/game1-practice.html" % port)
        print("  stop: Ctrl+C")
        server.serve_forever()
