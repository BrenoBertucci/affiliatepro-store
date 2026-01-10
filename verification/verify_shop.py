
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Navigate to Shop page
    page.goto("http://localhost:3000/#/shop")

    # Wait for the product grid to load
    page.wait_for_selector(".grid")

    # Wait for the search input to be visible
    page.wait_for_selector("input[placeholder='Buscar produtos...']")

    # Type 'Search'
    page.fill("input[placeholder='Buscar produtos...']", "tecnologia")

    # Wait for debounced search to trigger and results to update
    page.wait_for_timeout(2000)

    # Take screenshot
    page.screenshot(path="verification/shop_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
