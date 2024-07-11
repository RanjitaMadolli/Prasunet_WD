import requests
from bs4 import BeautifulSoup
import csv

# Function to extract product information
def extract_product_info(product):
    name = product.h3.a['title']
    price = product.find('p', class_='price_color').text
    rating = product.p['class'][1]  # Rating is stored as a class
    return name, price, rating

# Function to scrape data from a single page
def scrape_page(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    products = soup.find_all('article', class_='product_pod')
    return [extract_product_info(product) for product in products]

# Function to scrape multiple pages
def scrape_website(base_url, num_pages):
    all_products = []
    for page in range(1, num_pages + 1):
        url = f"{base_url}/catalogue/page-{page}.html"
        all_products.extend(scrape_page(url))
    return all_products

# Function to save data to a CSV file
def save_to_csv(products, filename):
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Name', 'Price', 'Rating'])
        writer.writerows(products)

def main():
    base_url = "http://books.toscrape.com"
    num_pages = 2  # Adjust the number of pages to scrape
    products = scrape_website(base_url, num_pages)
    save_to_csv(products, 'products.csv')
    print(f"Scraped {len(products)} products and saved to 'products.csv'.")

if __name__ == "__main__":
    main()
