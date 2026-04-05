import fitz  # PyMuPDF
import os

# Cấu hình đường dẫn
WORKBOOK_PDF = r"D:\Tài liệu tiếng Trung\HSK1\2.SÁCH BÀI TẬP HSK1.pdf"
OUTPUT_DIR = "public/images/workbook/hsk1"
LOG_FILE = "workbook_mapping.txt"

def ensure_dirs():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

def process_lesson_1():
    print("Slicing Lesson 1 (Page 7-10)...")
    doc = fitz.open(WORKBOOK_PDF)
    
    # Ở HSK 1 Workbook:
    # Trang 7: Phần nghe 1 (5 câu T/F)
    # Trang 8: Phần nghe 2 (5 câu Match A-E)
    # Trang 11: Phần đọc 1 (5 câu T/F)
    # Trang 12: Phần đọc 2 (5 câu Match A-E)
    
    # 1. Cắt trang Nghe 1 (Trang 7 - Index 6) -> 5 câu hỏi dọc
    page_7 = doc[6]
    h7, w7 = page_7.rect.height, page_7.rect.width
    for i in range(5):
        rect = fitz.Rect(0, (h7/5)*i, w7, (h7/5)*(i+1))
        pix = page_7.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect)
        pix.save(os.path.join(OUTPUT_DIR, f"hsk1_l1_l_p1_q{i+1}.jpg"))

    # 2. Cắt trang Đọc 1 (Trang 11 - Index 10) -> 5 câu hỏi dọc
    page_11 = doc[10]
    h11, w11 = page_11.rect.height, page_11.rect.width
    for i in range(5):
        rect = fitz.Rect(0, (h11/5)*i, w11, (h11/5)*(i+1))
        pix = page_11.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect)
        pix.save(os.path.join(OUTPUT_DIR, f"hsk1_l1_r_p1_q{i+1}.jpg"))

    print("  Successfully sliced Lesson 1 questions.")
    doc.close()

if __name__ == "__main__":
    ensure_dirs()
    process_lesson_1()
