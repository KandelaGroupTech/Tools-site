import os, glob
files = glob.glob('public/website-demos/excellentjob/*.html')
meta_tags = """
    <meta name="description" content="Journey Office Builders provides premium commercial construction, interior buildout, and tenant services in Northern Virginia, Washington D.C and Maryland. Experts in Washington DC tenant services, Northern Virginia Tenant services, and Maryland Tenant Services.">
    <meta name="keywords" content="Washington DC tenant services, Northern Virginia Tenant services, Maryland Tenant Services, commercial construction, interior buildout">"""

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if '<meta name="description"' not in content:
        content = content.replace('<title>', meta_tags + '\n    <title>')
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
            print(f"Added meta tags to {f}")
