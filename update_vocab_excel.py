import pandas as pd
import json
import re

excel_file = r"C:\Users\Lenovo\Downloads\TuVungTiengTrung_HoanChinh.xlsx"
json_file = r"d:\Antigravity\EZHSK\src\data\hsks.json"

df = pd.read_excel(excel_file)
df = df.fillna('')

with open(json_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

vocals_by_lesson = {}
for index, row in df.iterrows():
    bai_str = str(row['Bài'])
    match = re.search(r'\d+', bai_str)
    if match:
        lesson_id = int(match.group())
        if lesson_id not in vocals_by_lesson:
            vocals_by_lesson[lesson_id] = []
        
        example_zh = row.get('Ví dụ (Tiếng Trung)', '')
        example_vi = row.get('Ví dụ (Tiếng Việt)', '')
        example_str = ''
        if example_zh:
            example_str += example_zh
        if example_vi:
            example_str += f" ({example_vi})"

        vocab = {
            "hanzi": row.get('Từ vựng', '').strip(),
            "pinyin": row.get('Pinyin', '').strip(),
            "meaning": row.get('Ý nghĩa', '').strip(),
            "analysis": row.get('Phân tích bộ thủ', '').strip(),
            "example": example_str.strip()
        }
        vocals_by_lesson[lesson_id].append(vocab)

for level in data['levels']:
    if level['id'] == 'HSK 1':
        for lesson in level['lessons']:
            lid = lesson['lessonId']
            if lid in vocals_by_lesson:
                new_vocabs = vocals_by_lesson[lid]
                old_vocabs = lesson.get('vocabulary', [])
                
                # Create a lookup for old vocabs to preserve images
                old_vocab_map = {v['hanzi']: v for v in old_vocabs}
                
                merged_vocabs = []
                for nv in new_vocabs:
                    hz = nv['hanzi']
                    if hz in old_vocab_map:
                        ov = old_vocab_map[hz]
                        if 'image' in ov:
                            nv['image'] = ov['image']
                        if 'visualContext' in ov:
                            nv['visualContext'] = ov['visualContext']
                    merged_vocabs.append(nv)
                    
                lesson['vocabulary'] = merged_vocabs

with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Vocabulary updated successfully from Excel!")
