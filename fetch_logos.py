from duckduckgo_search import DDGS
import json

companies = [
    'Carr Properties',
    'CBRE',
    'Cushman & Wakefield',
    'Jones Lang LaSalle',
    'Lincoln Property Company',
    'Monument Realty',
    'Prologis',
    'Steuart Industrial Management',
    'Tysons Corner Center'
]

ddgs = DDGS()
results = {}

for c in companies:
    try:
        images = list(ddgs.images(f'{c} logo transparent', max_results=1))
        if images:
            results[c] = images[0]['image']
        else:
            results[c] = None
    except Exception as e:
        results[c] = str(e)

print(json.dumps(results, indent=2))
