from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Import our modules
from models.yield_predictor import YieldPredictor
from models.optimization_engine import OptimizationEngine
from data.data_processor import DataProcessor
from api.predictions import PredictionsAPI
from api.recommendations import RecommendationsAPI
from api.districts import DistrictsAPI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    CORS(app)
    api = Api(app)
    
    # Configuration
    app.config['MONGODB_URI'] = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/agri_siddhi')
    
    # Initialize components
    data_processor = DataProcessor()
    yield_predictor = YieldPredictor()
    optimization_engine = OptimizationEngine()
    
    # API Routes
    api.add_resource(PredictionsAPI, '/api/predictions', 
                    resource_class_kwargs={'yield_predictor': yield_predictor})
    api.add_resource(RecommendationsAPI, '/api/recommendations',
                    resource_class_kwargs={'optimization_engine': optimization_engine})
    api.add_resource(DistrictsAPI, '/api/districts',
                    resource_class_kwargs={'data_processor': data_processor})
    
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Agri-Siddhi API is running',
            'version': '1.0.0'
        })
    
    @app.route('/api/data/status')
    def data_status():
        try:
            status = data_processor.get_data_status()
            return jsonify(status)
        except Exception as e:
            logger.error(f"Error checking data status: {str(e)}")
            return jsonify({'error': 'Failed to check data status'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
