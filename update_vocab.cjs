const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'hsks.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const vocabUpdates = {
  "会": { analysis: "Có chứa bộ Nhân (人/亻), kết cấu trên-dưới.", visualContext: "Một người đang tự tin bơi lội hoặc chơi đàn." },
  "说": { analysis: "Có chứa bộ Ngôn (讠) thường liên quan đến lời nói, ngôn ngữ.", visualContext: "Một người đang phát biểu với bong bóng thoại (speech bubble)." },
  "妈妈": { analysis: "Chữ Hán chứa bộ Nữ (女) chỉ người phụ nữ.", visualContext: "Hình ảnh người mẹ đang ôm đứa con nhỏ." },
  "菜": { analysis: "Có chứa bộ Thảo đầu (艹), thường liên quan đến cây cỏ, thực vật.", visualContext: "Đĩa thức ăn ngon hoặc một bó rau xanh mướt." },
  "很": { analysis: "Từ chỉ mức độ cao, bổ nghĩa cho tính từ đứng sau.", visualContext: "Biểu tượng ngón tay cái giơ lên (Like) hoặc mũi tên chỉ lên cao." },
  "好吃": { analysis: "Ghép từ chữ 好 (tốt) và chữ 吃 (ăn), có chứa bộ Khẩu (口) chỉ hành động bằng miệng.", visualContext: "Một người đang ăn với vẻ mặt hạnh phúc, liếm mép." },
  "做": { analysis: "Chữ Hán hợp thể có kết cấu trái-giữa-phải, chứa bộ Nhân đứng (亻).", visualContext: "Đầu bếp đang cầm chảo xào nấu món ăn." },
  "写": { analysis: "Hành động viết, tạo ra chữ Hán.", visualContext: "Bàn tay đang cầm bút viết lên một trang giấy." },
  "汉字": { analysis: "Chữ 汉 (Hán) có bộ Thủy (氵) liên quan đến nước, chữ 字 (tự) mang ý nghĩa chữ viết.", visualContext: "Chiếc bút lông và cuộn giấy nếp viết thư pháp." },
  "字": { analysis: "Chứa bộ Miên (宀) ở trên và bộ Tử (子) ở dưới.", visualContext: "Một ký tự Hán tự lớn trên màn hình." },
  "怎么": { analysis: "Đại từ nghi vấn dùng để hỏi cách thức.", visualContext: "Người gãi đầu suy nghĩ với dấu chấm hỏi trên đầu." },
  "读": { analysis: "Chữ 读 chứa bộ Ngôn (讠) liên quan đến việc phát âm, lời nói.", visualContext: "Học sinh đang cầm sách mở rộng và đọc to." }
};

data.levels[0].lessons.forEach(lesson => {
  if (lesson.lessonId === 6) {
    lesson.vocabulary.forEach(v => {
      if (vocabUpdates[v.hanzi]) {
        v.analysis = vocabUpdates[v.hanzi].analysis;
        v.visualContext = vocabUpdates[v.hanzi].visualContext;
      }
    });
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Vocabulary for lesson 6 updated successfully!');
