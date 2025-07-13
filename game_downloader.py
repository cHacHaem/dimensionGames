import os
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

# === CONFIGURATION ===
URL = "https://www.onlinegames.io/games/2021/3/police-chase-drifter/index.html/"
DOWNLOAD_FOLDER = "downloaded_game"
HEADERS = {"User-Agent": "Mozilla/5.0"}

# === SETUP ===
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

def sanitize_path(url):
    parsed = urlparse(url)
    return os.path.join(DOWNLOAD_FOLDER, parsed.netloc + parsed.path).replace("?", "_")

def download_file(url):
    try:
        local_path = sanitize_path(url)
        if not os.path.exists(os.path.dirname(local_path)):
            os.makedirs(os.path.dirname(local_path), exist_ok=True)
        if not os.path.exists(local_path):
            response = requests.get(url, headers=HEADERS, timeout=10)
            response.raise_for_status()
            with open(local_path, "wb") as f:
                f.write(response.content)
            print(f"Downloaded: {url}")
        return local_path
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None

def download_assets_and_fix(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    tags_attrs = {
        "script": "src",
        "link": "href",
        "img": "src",
        "audio": "src",
        "video": "src",
        "source": "src"
    }

    for tag, attr in tags_attrs.items():
        for el in soup.find_all(tag):
            if el.has_attr(attr):
                abs_url = urljoin(base_url, el[attr])
                local_file = download_file(abs_url)
                if local_file:
                    rel_path = os.path.relpath(local_file, DOWNLOAD_FOLDER)
                    el[attr] = rel_path.replace("\\", "/")

    return str(soup)

def download_and_rewrite():
    r = requests.get(URL, headers=HEADERS)
    r.raise_for_status()
    html = r.text

    modified_html = download_assets_and_fix(html, URL)
    output_path = os.path.join(DOWNLOAD_FOLDER, "index.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(modified_html)
    print(f"\nAll done! Open {output_path} in your browser.")

if __name__ == "__main__":
    download_and_rewrite()
