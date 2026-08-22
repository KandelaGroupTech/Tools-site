from PIL import Image, ImageDraw, ImageFont
import os

def create_text_logo(text, output_path, fill_color=(227, 0, 15, 255)):
    # Create an image with transparent background
    img = Image.new('RGBA', (300, 150), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arialbd.ttf", 100) # Arial Bold
    except:
        font = ImageFont.load_default()
    
    # Draw text
    d.text((20, 20), text, fill=fill_color, font=font)
    
    # Crop to bounding box
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Created {output_path}")

os.chdir(r"C:\Users\richa\OneDrive\Documents\Claude Projects\ExcellentJOB Website\images\logos")
create_text_logo("JLL", "Jones_Lang_LaSalle.png")
