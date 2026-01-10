
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Navigate to Product Detail page with a dummy ID
    page.goto("http://localhost:3000/#/product/dummy-id")

    # Wait for the "Product not found" message or the product detail to load
    # In this environment, we expect "Product not found" or a loading state that resolves to it.
    try:
        page.wait_for_selector("text=Produto não encontrado", timeout=5000)
    except:
        # If not found immediately, maybe it's still loading or something else is displayed.
        pass

    # Take screenshot
    page.screenshot(path="verification/product_detail_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
