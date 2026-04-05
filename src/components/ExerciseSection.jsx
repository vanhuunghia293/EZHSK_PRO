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

  const handleAnswerSection = (index, answer) => {
    setUserAnswers({ ...userAnswers, [index]: answer });
  };

  const handleAnswer = (answer) => {
    setUserAnswers({ ...userAnswers, [currentIndex]: answer });
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

  if (view === 'QUIZ' && activeSection) {
    const totalQuestions = activeSection.questions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const progress = (answeredCount / totalQuestions) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Sticky Header with Progress */}
        <div className="sticky top-4 z-20 bg-white/80 backdrop-blur-xl border-2 border-slate-100 rounded-[2rem] p-4 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('LIST')} 
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
            >
              ←
            </button>
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">{activeLesson.title}</h3>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{activeSection.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex-1 md:w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-700 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <span className="text-xs font-black text-slate-400 whitespace-nowrap uppercase tracking-widest">
              Đã làm {answeredCount}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Master Audio Player (Only for LISTENING) */}
        {activeSection.type === 'LISTENING' && activeSection.questions[0]?.audio_url && (
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">Nghe toàn bộ đoạn hội thoại</span>
                <h4 className="text-xl font-bold">Phần nghe HSK 1 ({activeSection.questions[0].audio_url})</h4>
              </div>
              
              <button 
                onClick={() => audioRef.current.play()}
                className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group/play"
              >
                <span className="group-hover/play:scale-110 transition-transform">▶️</span>
              </button>
              
              <audio ref={audioRef} src={`/audio/${activeSection.questions[0].audio_url}`} />
              <p className="text-xs opacity-60 font-medium max-w-xs">Nhấn nút Play và theo dõi các hình ảnh bên dưới để chọn Đúng hoặc Sai.</p>
            </div>
          </div>
        )}

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {activeSection.questions.map((q, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-[2.5rem] border-2 transition-all duration-500 p-6 space-y-6 ${
                userAnswers[idx] !== undefined ? 'border-blue-100 shadow-lg shadow-blue-500/5' : 'border-slate-100 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400">
                  {idx + 1}
                </span>
                {userAnswers[idx] !== undefined && (
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Đã trả lời
                  </span>
                )}
              </div>

              {q.image_url && (
                <div className="aspect-video rounded-3xl overflow-hidden bg-slate-50 border-2 border-slate-50 group">
                  <img 
                    src={`/images/${q.image_url}`} 
                    alt={`Question ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                </div>
              )}

              {q.content && (
                <div className="text-center py-2">
                   <p className="text-3xl font-black text-slate-800 tracking-tight">{q.content}</p>
                </div>
              )}

              <div className="flex gap-3">
                {["TRUE", "FALSE"].map((opt) => {
                  const isSelected = userAnswers[idx] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswerSection(idx, opt)}
                      className={`flex-1 py-4 rounded-2xl border-2 font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                        isSelected
                          ? opt === 'TRUE' 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                          : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                      }`}
                    >
                      {opt === 'TRUE' ? '✓ Đúng' : '✗ Sai'}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Submit Button */}
        <div className="fixed bottom-8 left-0 right-0 z-30 px-6 flex justify-center">
          <button 
            disabled={answeredCount < totalQuestions}
            onClick={() => setView('RESULT')}
            className={`px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl flex items-center gap-4 ${
              answeredCount < totalQuestions
                ? 'bg-white border-2 border-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-blue-500/20'
            }`}
          >
            <span>Nộp bài & Xem kết quả</span>
            <span className="text-xl">✨</span>
          </button>
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
