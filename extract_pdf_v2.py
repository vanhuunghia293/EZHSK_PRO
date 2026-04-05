from pdfminer.high_level import extract_text
import os

pdf_path = r"D:\Tài liệu tiếng Trung\HSK1\1.GIÁO TRÌNH HSK1.pdf"
output_path = "hsk1_pdfminer_text.txt"

def run_extraction():
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found")
        return
    
    try:
        text = extract_text(pdf_path)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Extraction successful! Saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    run_extraction()
