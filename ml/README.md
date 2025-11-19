# ML Directory

This directory contains machine learning notebooks, data, and trained models for GreenPulseX.

## Structure

```
ml/
├── notebooks/          # Jupyter notebooks for analysis
│   ├── 01_data_exploration.ipynb
│   ├── 02_model_training.ipynb
│   └── 03_model_evaluation.ipynb
├── data/              # Training and test datasets
│   ├── raw/           # Raw sensor data
│   ├── processed/     # Processed features
│   └── samples/      # Sample datasets
└── models/            # Trained model artifacts
    └── saved/        # Saved model files
```

## Notebooks

### 01_data_exploration.ipynb
- Exploratory data analysis
- Feature distributions
- Correlation analysis
- Data quality checks

### 02_model_training.ipynb
- Model training pipeline
- Hyperparameter tuning
- Cross-validation
- Model comparison

### 03_model_evaluation.ipynb
- Model performance metrics
- Feature importance analysis
- Prediction visualization
- Error analysis

## Usage

1. **Start Jupyter**:
   ```bash
   cd ml/notebooks
   jupyter notebook
   ```

2. **Or use JupyterLab**:
   ```bash
   jupyter lab
   ```

3. **Run notebooks in order**:
   - Start with data exploration
   - Then model training
   - Finally evaluation

## Data Sources

- **Sensor Readings**: Real-time IoT sensor data
- **Historical Yield**: Past crop yield records
- **Weather Data**: External weather API integration
- **Soil Data**: Soil composition and NPK levels

## Model Training

Models are trained using the backend ML pipeline:

```bash
# Train model via backend
docker-compose exec backend python -m app.ml.train

# Or use the notebook
jupyter notebook ml/notebooks/02_model_training.ipynb
```

## Model Evaluation

Evaluate trained models:

```bash
docker-compose exec backend python -m app.ml.evaluate --model-version v1.0.0
```

