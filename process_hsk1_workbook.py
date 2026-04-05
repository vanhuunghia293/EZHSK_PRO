import fitz  # PyMuPDF
import os

# Cấu hình đường dẫn
WORKBOOK_PDF = r"D:\Tài liệu tiếng Trung\HSK1\2.SÁCH BÀI TẬP HSK1.pdf"
OUTPUT_DIR = "public/images/workbook/hsk1"
LOG_FILE = "workbook_mapping.txt"

# Cấu hình lề (để loại bỏ header/footer)
HEADER_MARGIN = 80  # Khoảng cách từ đỉnh trang xuống câu 1
FOOTER_MARGIN = 60  # Khoảng cách từ câu cuối xuống đáy trang

def ensure_dirs():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

def process_lesson_1():
    print("Slicing Lesson 1 (Page 7-10)...")
    if not os.path.exists(WORKBOOK_PDF):
        print(f"ERROR: Cannot find PDF at {WORKBOOK_PDF}")
        return

    doc = fitz.open(WORKBOOK_PDF)
    
    # 1. Cắt trang Nghe 1 (Trang 7 - Index 6) -> 5 câu hỏi dọc
    page_7 = doc[6]
    h7, w7 = page_7.rect.height, page_7.rect.width
    content_h = h7 - HEADER_MARGIN - FOOTER_MARGIN
    
    for i in range(5):
        y0 = HEADER_MARGIN + (content_h / 5) * i
        y1 = HEADER_MARGIN + (content_h / 5) * (i + 1)
        rect = fitz.Rect(0, y0, w7, y1)
        pix = page_7.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect)
        pix.save(os.path.join(OUTPUT_DIR, f"hsk1_l1_l_p1_q{i+1}.jpg"))

    # 2. Cắt trang Đọc 1 (Trang 11 - Index 10) -> 5 câu hỏi dọc
    # Lưu ý: Trong file PDF thật, bài đọc 1 thường nằm cách bài nghe vài trang
    page_11 = doc[10]
    h11, w11 = page_11.rect.height, page_11.rect.width
    content_h11 = h11 - HEADER_MARGIN - FOOTER_MARGIN
    
    for i in range(5):
        y0 = HEADER_MARGIN + (content_h11 / 5) * i
        y1 = HEADER_MARGIN + (content_h11 / 5) * (i + 1)
        rect = fitz.Rect(0, y0, w11, y1)
        pix = page_11.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect)
        pix.save(os.path.join(OUTPUT_DIR, f"hsk1_l1_r_p1_q{i+1}.jpg"))

    print("  Successfully sliced Lesson 1 questions with margins.")
    doc.close()

if __name__ == "__main__":
    ensure_dirs()
    process_lesson_1()
