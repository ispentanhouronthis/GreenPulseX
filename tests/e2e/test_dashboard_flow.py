"""
E2E test for dashboard flow
"""
import pytest
from playwright.sync_api import Page, expect


def test_dashboard_loads(page: Page):
    """Test that dashboard loads correctly"""
    page.goto("http://localhost:3000/dashboard")
    expect(page.locator("h1")).to_contain_text("Dashboard")


def test_sensor_data_display(page: Page):
    """Test that sensor data is displayed"""
    page.goto("http://localhost:3000/dashboard")
    # Wait for data to load
    page.wait_for_selector("[data-testid='sensor-charts']")
    # Check that charts are visible
    expect(page.locator("[data-testid='sensor-charts']")).to_be_visible()


def test_prediction_display(page: Page):
    """Test that predictions are displayed"""
    page.goto("http://localhost:3000/dashboard")
    page.wait_for_selector("[data-testid='predictions-panel']")
    expect(page.locator("[data-testid='predictions-panel']")).to_be_visible()

