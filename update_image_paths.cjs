const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'hsks.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

data.levels[0].lessons.forEach(lesson => {
  if (lesson.lessonId === 6) {
    lesson.vocabulary.forEach((v, index) => {
      v.image = `/vocab/l6_${index}.jpg`;
    });
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Image paths for lesson 6 updated successfully!');
