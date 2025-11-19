# Tests Directory

This directory contains all test files for GreenPulseX.

## Structure

```
tests/
├── e2e/              # End-to-end tests
│   ├── test_dashboard.py
│   ├── test_telemetry_flow.py
│   └── test_prediction_flow.py
├── unit/             # Unit tests
│   ├── test_ml_model.py
│   ├── test_services.py
│   └── test_utils.py
└── integration/      # Integration tests
    ├── test_api.py
    └── test_database.py
```

## Running Tests

### All Tests
```bash
# Backend tests
docker-compose exec backend pytest

# Frontend tests
cd frontend && npm test

# E2E tests
npm run test:e2e
```

### Specific Test Suites
```bash
# Unit tests only
docker-compose exec backend pytest tests/unit/

# Integration tests
docker-compose exec backend pytest tests/integration/

# E2E tests
npm run test:e2e
```

### Test Coverage
```bash
# Backend coverage
docker-compose exec backend pytest --cov=app --cov-report=html

# Frontend coverage
cd frontend && npm run test:coverage
```

## Test Types

### Unit Tests
- Test individual functions and classes
- Fast execution
- Isolated from external dependencies

### Integration Tests
- Test API endpoints
- Test database interactions
- Test service integrations

### E2E Tests
- Test complete user flows
- Test frontend-backend integration
- Use Playwright for browser automation

## Writing Tests

### Backend (Python)
```python
import pytest
from app.services.prediction_service import PredictionService

def test_prediction_service():
    service = PredictionService()
    result = service.predict_yield(farm_id="test")
    assert result is not None
```

### Frontend (TypeScript)
```typescript
import { render, screen } from '@testing-library/react';
import Dashboard from '@/app/dashboard/page';

test('renders dashboard', () => {
  render(<Dashboard />);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

