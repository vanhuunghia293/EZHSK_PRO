import React, { useState, useRef } from 'react';
import exerciseData from '../data/exerciseData.json';

const ExerciseSection = ({ levelId = "HSK 1" }) => {
  const [view, setView] = useState('LIST'); // LIST, QUIZ, RESULT, REVIEW
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const audioRef = useRef(null);

  const lessons = exerciseData[levelId] || [];

  const startExercise = (lesson, section) => {
    setActiveLesson(lesson);
    setActiveSection(section);
    setCurrentIndex(0);
    setUserAnswers({});
    setView('QUIZ');
  };

  const handleAnswer = (answer) => {
    setUserAnswers({ ...userAnswers, [currentIndex]: answer });
  };

  const nextQuestion = () => {
    if (currentIndex < activeSection.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setView('RESULT');
    }
  };

  const calculateScore = () => {
    let score = 0;
    activeSection.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_answer) score++;
    });
    return score;
  };

  // --- RENDERING VIEWS ---

  if (view === 'LIST') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Bài tập HSK 1</h2>
          <p className="text-slate-400 font-medium">Luyện tập kỹ năng Nghe và Đọc hiểu</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/5 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                  {lesson.id}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{lesson.title}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {lesson.sections.map((section, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => startExercise(lesson, section)}
                    className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-slate-50 hover:bg-blue-600 group/btn transition-all duration-300 active:scale-95"
                  >
                    <span className="text-2xl mb-1">{section.type === 'LISTENING' ? '🎧' : '📖'}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover/btn:text-white transition-colors">
                      {section.type === 'LISTENING' ? 'Luyện Nghe' : 'Luyện Đọc'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'QUIZ') {
    const question = activeSection.questions[currentIndex];
    const progress = ((currentIndex + 1) / activeSection.questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
        {/* Progress Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <button onClick={() => setView('LIST')} className="text-slate-400 hover:text-slate-800 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span>←</span> Thoát
            </button>
            <span className="text-xs font-black text-blue-500 uppercase tracking-widest">
              Câu {currentIndex + 1} / {activeSection.questions.length}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-[3rem] border-2 border-slate-100 p-8 md:p-12 shadow-sm space-y-10">
          <div className="space-y-4">
            <h4 className="text-blue-400 font-black text-xs uppercase tracking-widest">{activeSection.title}</h4>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">{question.instruction}</h2>
          </div>

          <div className="space-y-8">
            {/* Audio Section */}
            {question.audio_url && (
              <div className="flex flex-col items-center gap-4 py-8 bg-blue-50/50 rounded-[2rem] border-2 border-dashed border-blue-100">
                <button 
                  onClick={() => audioRef.current.play()}
                  className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all"
                >
                  🔊
                </button>
                <audio ref={audioRef} src={`/audio/${question.audio_url}`} />
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Nhấn để nghe câu hỏi</span>
              </div>
            )}

            {/* Image Section */}
            {question.image_url && (
              <div className="relative group max-w-sm mx-auto overflow-hidden rounded-[2.5rem] border-4 border-white shadow-xl shadow-slate-200/50">
                <img src={`/images/${question.image_url}`} alt="question" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            {/* Content (Text) */}
            {question.content && (
              <div className="text-center py-6">
                <p className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">{question.content}</p>
              </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              {(question.options || ["TRUE", "FALSE"]).map((opt, i) => {
                const isSelected = userAnswers[currentIndex] === (question.question_type === 'TRUE_FALSE' ? opt : opt.charAt(0));
                
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(question.question_type === 'TRUE_FALSE' ? opt : opt.charAt(0))}
                    className={`p-6 rounded-[2rem] border-2 font-bold transition-all duration-300 text-left flex items-center gap-4 ${
                      isSelected 
                        ? 'bg-blue-500 border-blue-500 text-white shadow-xl shadow-blue-500/20 -translate-y-1' 
                        : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                      {question.question_type === 'TRUE_FALSE' ? (opt === 'TRUE' ? '✓' : '✗') : opt.charAt(0)}
                    </span>
                    <span className="text-lg">{question.question_type === 'TRUE_FALSE' ? (opt === 'TRUE' ? 'Đúng' : 'Sai') : opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-8 flex justify-center">
            <button 
              disabled={userAnswers[currentIndex] === undefined}
              onClick={nextQuestion}
              className={`px-12 py-5 rounded-[2rem] font-bold text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-xl ${
                userAnswers[currentIndex] === undefined 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50' 
                  : 'bg-slate-900 text-white hover:bg-blue-600 shadow-blue-500/10'
              }`}
            >
              {currentIndex < activeSection.questions.length - 1 ? 'Tiếp tục →' : 'Xem kết quả ✨'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'RESULT') {
    const finalScore = calculateScore();
    const total = activeSection.questions.length;
    const isPass = finalScore / total >= 0.5;

    return (
      <div className="max-w-2xl mx-auto text-center space-y-12 animate-in fade-in zoom-in-95 duration-500 py-10">
        <div className="space-y-6">
          <div className="text-8xl mb-8">{isPass ? '🏆' : '💪'}</div>
          <h2 className="text-5xl font-black text-slate-800">{isPass ? 'Tuyệt vời!' : 'Cố lên!'}</h2>
          <div className="flex justify-center gap-4">
             <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm min-w-[12rem]">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Điểm số</p>
                <p className="text-6xl font-black text-blue-500">{finalScore}<span className="text-2xl text-slate-300">/{total}</span></p>
             </div>
             <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-sm min-w-[12rem]">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tỷ lệ</p>
                <p className="text-6xl font-black text-emerald-500">{Math.round((finalScore/total)*100)}<span className="text-2xl text-slate-300">%</span></p>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button 
            onClick={() => setView('LIST')}
            className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
          >
            Quay lại trang chủ
          </button>
          <button 
            onClick={() => setView('QUIZ')}
            className="w-full sm:w-auto px-12 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-[2rem] font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            Làm lại
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ExerciseSection;
