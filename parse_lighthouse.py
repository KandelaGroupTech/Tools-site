import json
with open(r'C:\Users\richa\AppData\Local\Temp\chrome-devtools-mcp-yKRiRf\report.json', 'r', encoding='utf-8') as f:
    d = json.load(f)
for k, v in d['audits'].items():
    if v.get('score') is not None and v['score'] < 1:
        print(f"{k}: {v['score']} - {v['title']}")
