import PyPDF2
import os
import glob
import sys

# Silent extraction to avoid console encoding issues
def extract_text():
    try:
        files = glob.glob(r"D:\*\HSK2\*.pdf")
        if not files:
            files = [r"D:\Tài liệu tiếng Trung\HSK2\1. GIAO TRINH HSK2.pdf"]
        
        target_file = None
        for f in files:
            if "1. GIAO TRINH HSK2.pdf" in f or "1. GIÁO TRÌNH" in f:
                target_file = f
                break
        
        if not target_file and files:
            target_file = files[0]

        if not target_file or not os.path.exists(target_file):
            return

        with open(target_file, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page_num in range(len(reader.pages)):
                try:
                    page_text = reader.pages[page_num].extract_text()
                    if page_text:
                        text += f"\n--- Page {page_num + 1} ---\n"
                        text += page_text
                except:
                    pass
            
            with open("hsk2_extracted_text.txt", "w", encoding="utf-8") as out:
                out.write(text)
    except:
        pass

if __name__ == "__main__":
    extract_text()
