import urllib.request
import os

url = "https://upload.wikimedia.org/wikipedia/commons/4/4e/JLL_Logo.svg"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
)

try:
    with urllib.request.urlopen(req) as response:
        svg_content = response.read()

    os.chdir(r"C:\Users\richa\OneDrive\Documents\Claude Projects\ExcellentJOB Website\images\logos")
    with open("Jones_Lang_LaSalle.svg", "wb") as f:
        f.write(svg_content)
    print("Downloaded SVG successfully!")
except Exception as e:
    print(f"Error: {e}")
