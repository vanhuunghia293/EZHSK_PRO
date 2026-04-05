import os
from PIL import Image

def crop_vocabulary_grid(input_path, output_dir):
    try:
        # Tải ảnh
        img = Image.open(input_path)
        img_width, img_height = img.size
        
        # Lưới là 4 cột, 3 hàng
        cols = 4
        rows = 3
        
        # Kích thước mỗi ô
        cell_width = img_width / cols
        cell_height = img_height / rows
        
        # Đảm bảo thư mục đầu ra tồn tại
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        index = 0
        for r in range(rows):
            for c in range(cols):
                # Tính toán tọa độ crop (cắt bớt một chút viền để khung ảnh đẹp hơn)
                margin_x = cell_width * 0.03
                margin_y = cell_height * 0.03
                
                left = (c * cell_width) + margin_x
                top = (r * cell_height) + margin_y
                right = ((c + 1) * cell_width) - margin_x
                bottom = ((r + 1) * cell_height) - margin_y
                
                # Cắt và lưu ảnh (ép kiểu int cho box)
                img_crop = img.crop((int(left), int(top), int(right), int(bottom)))
                
                # Lưu dưới dạng jpg chất lượng cao
                out_path = os.path.join(output_dir, f'l6_{index}.jpg')
                # Chuyển RGBA thành RGB nếu là PNG
                if img_crop.mode in ('RGBA', 'P'): 
                    img_crop = img_crop.convert('RGB')
                
                img_crop.save(out_path, quality=95)
                print(f"✅ Đã trích xuất thành công: {out_path}")
                index += 1
                
        print("\n🎉 Hoàn thành! 12 ảnh từ vựng đã được lưu vào: " + output_dir)
        print("Bây giờ bạn có thể refresh ứng dụng để xem giao diện mới!")
    except Exception as e:
        print(f"Lỗi: {e}")

if __name__ == "__main__":
    input_file = "grid6.jpg" # Tên file ảnh gốc
    output_folder = os.path.join("public", "vocab")
    
    if os.path.exists(input_file):
        crop_vocabulary_grid(input_file, output_folder)
    else:
        print(f"❌ Không tìm thấy file gốc '{input_file}'. Xin hãy chắc chắn rằng bạn đã lưu ảnh vào thư mục dự án với tên 'grid6.jpg'.")
