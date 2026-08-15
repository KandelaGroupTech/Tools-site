import re

with open('public/website-demos/excellentjob/projects.html', 'r', encoding='utf-8') as f:
    html = f.read()

def replace_placeholder(html, color_bg, img_name):
    # Matches the placeholder div and its icon child
    pattern = r'<div style="width: 100%; height: 250px; background-color: ' + color_bg + r'; display: flex; align-items: center; justify-content: center;">\s*<i[^>]+></i>\s*</div>'
    img_tag = f'<img src="images/projects/{img_name}.png" alt="Project" style="width: 100%; height: 250px; object-fit: cover; transition: transform var(--transition-normal);" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">'
    return re.sub(pattern, img_tag, html)

# Mappings from the background color to the image name
html = replace_placeholder(html, '#e0f2fe', 'corporate_headquarters')
html = replace_placeholder(html, '#f1f5f9', 'law_firm_suite')
html = replace_placeholder(html, '#fef3c7', 'lobby_refit')
html = replace_placeholder(html, '#fee2e2', 'retail_space')
html = replace_placeholder(html, '#fce7f3', 'boutique')
html = replace_placeholder(html, '#e0e7ff', 'industrial_warehouse')
html = replace_placeholder(html, '#d1fae5', 'distribution_center')

with open('public/website-demos/excellentjob/projects.html', 'w', encoding='utf-8') as f:
    f.write(html)
