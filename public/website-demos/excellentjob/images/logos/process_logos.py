from PIL import Image, ImageDraw, ImageFont
import os

def remove_light_background(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        data = img.getdata()
        new_data = []
        for item in data:
            # item is (R, G, B, A)
            # If the pixel is very light (white or light grey from checkerboard)
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                new_data.append((255, 255, 255, 0)) # fully transparent
            else:
                new_data.append(item)
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Processed {input_path}")
    except Exception as e:
        print(f"Failed to process {input_path}: {e}")

def create_text_logo(text, output_path):
    # Create an image with transparent background
    img = Image.new('RGBA', (400, 100), (255, 255, 255, 0))
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", 36)
    except:
        font = ImageFont.load_default()
    
    # Draw text
    d.text((20, 30), text, fill=(50, 50, 50, 255), font=font)
    img.save(output_path, "PNG")
    print(f"Created {output_path}")

os.chdir(r"C:\Users\richa\OneDrive\Documents\Claude Projects\ExcellentJOB Website\images\logos")

remove_light_background("CBRE.png", "CBRE_real_transparent.png")
remove_light_background("Cushman_and_Wakefield.png", "Cushman_and_Wakefield_real_transparent.png")
create_text_logo("CARR PROPERTIES", "Carr_Properties_real_transparent.png")
