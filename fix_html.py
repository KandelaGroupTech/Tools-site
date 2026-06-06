import glob
import re

files = glob.glob('public/website-demos/excellentjob/*.html')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    # 1. Add aria-label to mobile menu
    content = content.replace('<button class="mobile-menu-btn">', '<button class="mobile-menu-btn" aria-label="Mobile Menu">')
    
    # 2. Change <h4> to <h3> in footer
    content = content.replace('<h4>Quick Links</h4>', '<h3>Quick Links</h3>')
    content = content.replace('<h4>Contact</h4>', '<h3>Contact</h3>')
    
    # 3. Add <main> tags around content between header and footer
    if '<main>' not in content and '</header>' in content and '<footer class="footer">' in content:
        content = content.replace('</header>', '</header>\n\n    <main>')
        content = content.replace('    <footer class="footer">', '    </main>\n\n    <footer class="footer">')
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
        print(f"Updated {f}")
