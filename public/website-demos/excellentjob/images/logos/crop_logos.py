from PIL import Image
import os

def crop_transparent(filepath):
    try:
        img = Image.open(filepath).convert("RGBA")
        # getbbox() returns the bounding box of the non-zero regions in the image.
        bbox = img.getbbox()
        if bbox:
            img_cropped = img.crop(bbox)
            img_cropped.save(filepath)
            print(f"Cropped {filepath} to bbox {bbox}")
        else:
            print(f"No bounding box found for {filepath} (image might be empty)")
    except Exception as e:
        print(f"Failed to crop {filepath}: {e}")

os.chdir(r"C:\Users\richa\OneDrive\Documents\Claude Projects\ExcellentJOB Website\images\logos")
crop_transparent("Jones_Lang_LaSalle.png")
crop_transparent("Lincoln_Property_Company.png")
