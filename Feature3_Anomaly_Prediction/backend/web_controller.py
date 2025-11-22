#!/usr/bin/env python3
"""
Gyatah Web Controller - Connects UI with Urban Anomaly Engine
Run: python web_controller.py
"""

import http.server
import socketserver
import webbrowser
import os
import json
import cgi
import threading
from urban_anomaly import run_analysis_with_params
import pandas as pd

PORT = 8000

class GyatahRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        frontend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend')
        super().__init__(*args, directory=frontend_dir, **kwargs)
    
    def do_GET(self):
        if self.path == '/api/status':
            self.handle_get_status()
        elif self.path == '/api/get_results':
            self.handle_get_results()
        else:
            super().do_GET()
    
    def handle_get_status(self):
        """Handle status check"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        status = {
            'analysis_running': False,  # We don't have a way to track yet, so always false
            'csv_files_exist': {
                'anomalies': os.path.exists('anomalies.csv'),
                'predictions': os.path.exists('predicted_upcoming_anoms.csv')
            }
        }
        self.wfile.write(json.dumps(status).encode())
    
    def handle_get_results(self):
        """Handle GET request for results"""
        try:
            # Load and return analysis results
            results = {}
            
            if os.path.exists('anomalies.csv'):
                try:
                    anomalies_df = pd.read_csv('anomalies.csv')
                    # Convert any date columns to string to avoid JSON serialization issues
                    for col in anomalies_df.columns:
                        if 'time' in col.lower() or 'date' in col.lower():
                            anomalies_df[col] = anomalies_df[col].astype(str)
                    results['anomalies'] = anomalies_df.to_dict('records')
                except Exception as e:
                    print(f"Error reading anomalies.csv: {e}")
                    results['anomalies'] = []
            
            if os.path.exists('predicted_upcoming_anoms.csv'):
                try:
                    predictions_df = pd.read_csv('predicted_upcoming_anoms.csv')
                    # Convert any date columns to string
                    for col in predictions_df.columns:
                        if 'time' in col.lower() or 'date' in col.lower():
                            predictions_df[col] = predictions_df[col].astype(str)
                    results['predictions'] = predictions_df.to_dict('records')
                except Exception as e:
                    print(f"Error reading predictions.csv: {e}")
                    results['predictions'] = []
            
            if os.path.exists('analysis_summary.json'):
                try:
                    with open('analysis_summary.json', 'r') as f:
                        results['summary'] = json.load(f)
                except Exception as e:
                    print(f"Error reading summary: {e}")
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(results).encode())
            
        except Exception as e:
            print(f"Error in handle_get_results: {e}")
            self.send_error(500, f"Error loading results: {str(e)}")
    
    def do_POST(self):
        if self.path == '/api/run_analysis':
            self.handle_run_analysis()
        else:
            self.send_error(404, "Endpoint not found")
    
    def handle_run_analysis(self):
        """Handle analysis request"""
        try:
            # Parse form data
            content_type = self.headers.get('Content-Type', '')
            if not content_type.startswith('multipart/form-data'):
                self.send_error(400, "Only multipart/form-data supported")
                return
            
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST', 'CONTENT_TYPE': content_type}
            )
            
            # Extract parameters with safe defaults
            params = {
                'z_threshold': float(form.getvalue('z_threshold', 3.0)),
                'rel_threshold': float(form.getvalue('rel_threshold', 0.6)),
                'run_prediction': form.getvalue('run_prediction') == 'true',
                'horizon': int(form.getvalue('horizon', 6)),
                'window_start': int(form.getvalue('window_start', 7)),
                'window_end': int(form.getvalue('window_end', 12))
            }
            
            print(f"Received parameters: {params}")
            
            # Handle file uploads - FIXED: Proper FieldStorage checking
            if 'pune_file' in form:
                pune_file = form['pune_file']
                if pune_file.filename:  # Check if filename is not empty
                    pune_path = 'uploaded_pune.csv'
                    with open(pune_path, 'wb') as f:
                        f.write(pune_file.file.read())
                    params['pune_path'] = pune_path
                    print(f"Saved Pune file: {pune_file.filename}")
            
            if 'aqi_file' in form:
                aqi_file = form['aqi_file']
                if aqi_file.filename:  # Check if filename is not empty
                    aqi_path = 'uploaded_aqi.csv'
                    with open(aqi_path, 'wb') as f:
                        f.write(aqi_file.file.read())
                    params['aqi_path'] = aqi_path
                    print(f"Saved AQI file: {aqi_file.filename}")
            
            # Run analysis in background thread
            def run_analysis():
                try:
                    run_analysis_with_params(params)
                except Exception as e:
                    print(f"Analysis error: {e}")
                    import traceback
                    traceback.print_exc()
            
            analysis_thread = threading.Thread(target=run_analysis, daemon=True)
            analysis_thread.start()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = {'status': 'analysis_started', 'params': params}
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            print(f"Error handling analysis request: {e}")
            import traceback
            traceback.print_exc()
            self.send_error(500, f"Server error: {str(e)}")

def main():
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # Create necessary directories if they don't exist
    os.makedirs('uploads', exist_ok=True)
    
    with socketserver.TCPServer(("", PORT), GyatahRequestHandler) as httpd:
        print(f"Gyatah Web Controller running at: http://localhost:{PORT}/")
        print("Press Ctrl+C to stop the server")
        
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}/gyatah_dashboard.html')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")

if __name__ == "__main__":
    main()