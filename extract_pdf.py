import PyPDF2
import os

pdf_path = r"D:\Tài liệu tiếng Trung\HSK1\1.GIÁO TRÌNH HSK1.pdf"
output_path = "hsk1_extracted_text.txt"

def extract_text():
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found")
        return

    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            text += f"\n--- Page {page_num + 1} ---\n"
            text += reader.pages[page_num].extract_text()
        
        with open(output_path, "w", encoding="utf-8") as out:
            out.write(text)
        print(f"Extraction successful! Saved to {output_path}")

if __name__ == "__main__":
    extract_text()
