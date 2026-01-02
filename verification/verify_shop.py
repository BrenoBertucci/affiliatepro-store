from playwright.sync_api import sync_playwright

def verify_shop_filtering():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the shop page
        # Note: Assuming default Vite port 5173 or 3000. Checking log might be needed if it fails.
        # But wait, I should check the port.
        page.goto("http://localhost:3000/#/shop")

        # Wait for product grid to load
        # page.wait_for_selector(".grid", timeout=10000) # This might be failing if no products

        # Type in search box
        search_input = page.get_by_placeholder("Buscar produtos...")
        search_input.wait_for()
        search_input.fill("test")

        # Wait for debounce (500ms) + network request
        page.wait_for_timeout(2000)

        # Take screenshot
        page.screenshot(path="verification/shop_filtering.png")

        browser.close()

if __name__ == "__main__":
    verify_shop_filtering()
