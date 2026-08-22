import urllib.request
import json
import os

api_url = "https://en.wikipedia.org/w/api.php?action=query&titles=File:JLL_logo.svg&prop=imageinfo&iiprop=url&format=json"
req = urllib.request.Request(
    api_url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
)

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
    
    pages = data['query']['pages']
    page_id = list(pages.keys())[0]
    image_url = pages[page_id]['imageinfo'][0]['url']
    print(f"Found URL: {image_url}")
    
    # Download the actual image
    img_req = urllib.request.Request(
        image_url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    with urllib.request.urlopen(img_req) as response:
        svg_content = response.read()

    os.chdir(r"C:\Users\richa\OneDrive\Documents\Claude Projects\ExcellentJOB Website\images\logos")
    with open("Jones_Lang_LaSalle.svg", "wb") as f:
        f.write(svg_content)
    print("Downloaded SVG successfully!")
except Exception as e:
    print(f"Error: {e}")
