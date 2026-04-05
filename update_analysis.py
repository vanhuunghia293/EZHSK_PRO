import json
import re

# Load the raw analysis text
with open('hsk1_analysis_raw.txt', 'r', encoding='utf-8') as f:
    raw_lines = f.readlines()

# Dict to store the mapping mapping hanzi -> analysis
analysis_dict = {}
current_hanzi = None

# Parsing the raw text
for line in raw_lines:
    line = line.strip()
    
    # Check if line matches a vocabulary header, e.g., "1. **你 (nǐ) - Bạn, anh, chị**"
    match_vocab = re.search(r'\d+\.\s+\*\*(.*?)\s+\(', line)
    if match_vocab:
        current_hanzi = match_vocab.group(1).strip()
    
    # Check if line matches an analysis point, e.g., "- Phân tích: Chữ Hán này có bộ Nhân đứng..."
    match_analysis = re.search(r'-\s+Phân tích:\s+(.*)', line)
    if match_analysis and current_hanzi:
        analysis_text = match_analysis.group(1).strip()
        analysis_dict[current_hanzi] = analysis_text

print(f"Parsed {len(analysis_dict)} vocabulary analysis items.")

# Load the hsks.json file
json_path = 'src/data/hsks.json'
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update the JSON data
updated_count = 0
for level in data.get('levels', []):
    if level['id'] == 'HSK 1':
        for lesson in level.get('lessons', []):
            for vocab in lesson.get('vocabulary', []):
                hanzi = vocab['hanzi']
                if hanzi in analysis_dict:
                    vocab['analysis'] = analysis_dict[hanzi]
                    updated_count += 1

print(f"Updated {updated_count} vocabulary items in hsks.json.")

# Save the updated JSON data back
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Finished updating hsks.json.")
