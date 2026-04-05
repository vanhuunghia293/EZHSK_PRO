import fitz  # PyMuPDF
import os
import sys
import io

# Đảm bảo in được tiếng Việt trên console Windows
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Đường dẫn đến file PDF và thư mục lưu ảnh
PDF_PATH = r"D:\Tài liệu tiếng Trung\HSK1\2.SÁCH BÀI TẬP HSK1.pdf"
OUTPUT_DIR = "extracted_images"

def extract_images_from_pdf(pdf_path, output_dir):
    # Create output directory if not exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory: {output_dir}")

    # Check if PDF file exists
    if not os.path.exists(pdf_path):
        print(f"ERROR: Cannot find PDF at: {pdf_path}")
        return

    # Open PDF file
    try:
        pdf_file = fitz.open(pdf_path)
        print(f"Opened PDF successfully.")
    except Exception as e:
        print(f"ERROR opening PDF: {str(e)}")
        return

    image_count = 0

    # Loop through pages
    for page_index in range(len(pdf_file)):
        page = pdf_file[page_index]
        image_list = page.get_images(full=True)

        if not image_list:
            continue

        print(f"Page {page_index + 1}: Extracting {len(image_list)} images...")

        for image_index, img in enumerate(image_list, start=1):
            try:
                xref = img[0]
                base_image = pdf_file.extract_image(xref)
                image_bytes = base_image["image"]
                
                image_filename = f"image_p{page_index + 1}_{image_index}.jpg"
                image_path = os.path.join(output_dir, image_filename)

                with open(image_path, "wb") as f:
                    f.write(image_bytes)
                
                image_count += 1
            except:
                continue

    pdf_file.close()
    print("-" * 30)
    print(f"DONE! Extracted {image_count} images.")
    print(f"Images are saved in: {os.path.abspath(output_dir)}")

if __name__ == "__main__":
    extract_images_from_pdf(PDF_PATH, OUTPUT_DIR)
