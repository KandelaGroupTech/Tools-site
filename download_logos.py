import json
import urllib.request
import os

urls = {
  "Carr Properties": "https://mms.businesswire.com/media/20190128005149/en/702554/23/Carr-logo-color_edited.jpg",
  "CBRE": "https://p7.hiclipart.com/preview/679/321/108/cbre-group-real-estate-savills-cbre-rotterdam-property-developer-others.jpg",
  "Cushman & Wakefield": "https://pngset.com/images/cushman-and-wakefield-logo-text-alphabet-word-label-transparent-png-1134782.png",
  "Jones Lang LaSalle": "https://vectorseek.com/wp-content/uploads/2026/01/Jones-Lang-LaSalle-Hotels-Logo-PNG-SVG-Vector-01.png",
  "Lincoln Property Company": "https://theretailconnection.net/wp-content/uploads/2018/05/Lincoln-Property-Company-4c.png",
  "Monument Realty": "https://www.monumentrealtynh.com/wp-content/uploads/2023/05/monument-realty-logo.png",
  "Prologis": "https://companieslogo.com/img/orig/PLD_BIG-563f771d.png?t=1634016850",
  "Steuart Industrial Management": "https://www.stewartindustrialjm.com/wp-content/blogs.dir/506/files/2023/09/si-logo-CENTERED-POSITIVE-768x746.png",
  "Tysons Corner Center": "https://assets.macerichepicenter.com/FileManager/Property/Logos/TysonsCornerCenter/Tysons_Black_Logo_300x300.png"
}

target_dirs = [
    r"C:\Users\richa\OneDrive\Documents\Claude Projects\ExcellentJOB Website\images\logos",
    r"P:\02. Business\00. Websites\KandelaGroupHome\Tools-site\public\website-demos\excellentjob\images\logos"
]

for d in target_dirs:
    os.makedirs(d, exist_ok=True)

for name, url in urls.items():
    filename = name.replace(' ', '_').replace('&', 'and') + '.png'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = response.read()
            for d in target_dirs:
                with open(os.path.join(d, filename), 'wb') as f:
                    f.write(data)
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed {name}: {e}")
