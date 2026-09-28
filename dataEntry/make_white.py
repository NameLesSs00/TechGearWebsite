from PIL import Image

def make_white_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Keep alpha (item[3]), change R, G, B to 255
        if item[3] > 0:
            new_data.append((255, 255, 255, item[3]))
        else:
            new_data.append((255, 255, 255, 0))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Saved {output_path}")

input_img = r"C:\Users\VIP\Desktop\work\techgearwebsite\dataEntry\Logo.png"
output_img = r"C:\Users\VIP\Desktop\work\techgearwebsite\dataEntry\Logo_white.png"

make_white_logo(input_img, output_img)
