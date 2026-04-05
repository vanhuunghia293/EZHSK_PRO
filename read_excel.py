import pandas as pd
import json

file_path = r"C:\Users\Lenovo\Downloads\TuVungTiengTrung_HoanChinh.xlsx"

try:
    df = pd.read_excel(file_path)
    print("Columns:", df.columns.tolist())
    print(df.head(5).to_dict(orient='records'))
except Exception as e:
    print("Error:", e)
