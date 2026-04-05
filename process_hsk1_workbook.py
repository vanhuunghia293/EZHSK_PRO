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
    print("Slicing Lesson 1 (Page 7-12)...")
    if not os.path.exists(WORKBOOK_PDF):
        print(f"ERROR: Cannot find PDF at {WORKBOOK_PDF}")
        return

    doc = fitz.open(WORKBOOK_PDF)
    
    # --- 1. PHẦN NGHE 1 (Trang 7 - Index 6) ---
    page_7 = doc[6]
    h7, w7 = page_7.rect.height, page_7.rect.width
    
    # Trích xuất 2 ví dụ (nằm ở khoảng y:100 đến 300)
    # Ví dụ 1: 100-200, Ví dụ 2: 200-300 (ước lượng)
    for i in range(2):
        rect = fitz.Rect(0, 100 + 100*i, w7, 100 + 100*(i+1))
        pix = page_7.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect)
        pix.save(os.path.join(OUTPUT_DIR, f"hsk1_l1_l_p1_ex{i+1}.jpg"))

    # 5 câu hỏi chính (y:300 đến đáy)
    content_h7 = h7 - 310 - 80 
    for i in range(5):
        y0 = 310 + (content_h7 / 5) * i
        y1 = 310 + (content_h7 / 5) * (i + 1)
        rect = fitz.Rect(0, y0, w7, y1)
        pix = page_7.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect)
        pix.save(os.path.join(OUTPUT_DIR, f"hsk1_l1_l_p1_q{i+1}.jpg"))

    # --- 2. PHẦN NGHE 2 (Trang 8 - Index 7) ---
    page_8 = doc[7]
    h8, w8 = page_8.rect.height, page_8.rect.width
    # Gallery A-F
    grid_rect = fitz.Rect(50, 150, w8 - 50, 550)
    gh, gw = grid_rect.height, grid_rect.width
    labels = ['A', 'B', 'C', 'D', 'E', 'F']
    for row in range(3):
        for col in range(2):
            idx = row * 2 + col
            x0 = grid_rect.x0 + (gw / 2) * col
            y0 = grid_rect.y0 + (gh / 3) * row
            x1 = x0 + (gw / 2)
            y1 = y0 + (gh / 3)
            rect = fitz.Rect(x0, y0, x1, y1)
            pix = page_8.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect)
            pix.save(os.path.join(OUTPUT_DIR, f"hsk1_l1_gallery_{labels[idx]}.jpg"))

    # Trích xuất Ví dụ Phần 2 (nằm dưới Gallery, y:550-650)
    rect_ex2 = fitz.Rect(0, 550, w8, 700)
    pix_ex2 = page_8.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect_ex2)
    pix_ex2.save(os.path.join(OUTPUT_DIR, f"hsk1_l1_l_p2_ex.jpg"))

    # --- 3. PHẦN ĐỌC 1 (Trang 11 - Index 10) ---
    page_11 = doc[10]
    h11, w11 = page_11.rect.height, page_11.rect.width
    content_h11 = h11 - 180 - 100
    for i in range(5):
        y0 = 180 + (content_h11 / 5) * i
        y1 = 180 + (content_h11 / 5) * (i + 1)
        rect = fitz.Rect(0, y0, w11, y1)
        pix = page_11.get_pixmap(matrix=fitz.Matrix(2, 2), clip=rect)
        pix.save(os.path.join(OUTPUT_DIR, f"hsk1_l1_r_p1_q{i+1}.jpg"))

    print("  DONE: Lesson 1 Parts 1, 2 (+Examples), Reading 1.")
    doc.close()

if __name__ == "__main__":
    ensure_dirs()
    process_lesson_1()
