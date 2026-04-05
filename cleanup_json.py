import json
import re

with open('src/data/hsks.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def clean_text(text):
    if not isinstance(text, str):
        return text
    # Remove the trailing dashes and spaces
    return re.sub(r'\s*-+\s*$', '', text).strip()

for level in data.get('levels', []):
    for lesson in level.get('lessons', []):
        if 'vocabulary' in lesson:
            for v in lesson['vocabulary']:
                if 'example' in v:
                    v['example'] = clean_text(v['example'])
        if 'grammar' in lesson:
            for g in lesson['grammar']:
                if 'example' in g:
                    g['example'] = clean_text(g['example'])

with open('src/data/hsks.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Cleaned up hsks.json successfully.")
