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

    const renderExample = (ex, type) => {
      if (type === 'LISTENING_P1' || type === 'READING_P1') {
        return (
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200 opacity-60">
            <img src={`/images/${ex.image_url}`} alt="Example" className="w-24 h-24 object-cover rounded-xl border-2 border-white" />
            <div className="flex-1">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ví dụ</span>
               <div className="flex gap-2 mt-2">
                 <div className={`px-4 py-2 rounded-lg font-black text-xs ${ex.correct_answer === 'TRUE' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>✓ Đúng</div>
                 <div className={`px-4 py-2 rounded-lg font-black text-xs ${ex.correct_answer === 'FALSE' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-400'}`}>✗ Sai</div>
               </div>
            </div>
          </div>
        );
      }
      if (type === 'LISTENING_P2') {
        return (
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200 opacity-60 flex flex-col items-center gap-3">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ví dụ</span>
             <img src={`/images/${ex.image_url}`} alt="Example" className="max-w-xs rounded-xl" />
             <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-black">{ex.correct_answer}</div>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-32">
        {/* Header */}
        <div className="sticky top-4 z-20 bg-white/80 backdrop-blur-xl border-2 border-slate-100 rounded-[2rem] p-4 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('LIST')} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">←</button>
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">{activeLesson.title}</h3>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{activeSection.type.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex-1 md:w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-black text-slate-400 whitespace-nowrap tracking-widest">Đã làm {answeredCount}/{totalQuestions}</span>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <h4 className="text-blue-500 font-bold text-xs uppercase tracking-[0.2em]">{activeSection.title}</h4>
            <h2 className="text-2xl font-black text-slate-800 leading-tight">{activeSection.instruction}</h2>
          </div>

          {/* Audio Player */}
          {activeSection.audio_url && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-3xl border-2 border-blue-100/50">
              <button 
                onClick={() => audioRef.current.play()}
                className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                ▶️
              </button>
              <div className="flex-1">
                 <p className="text-xs font-black text-blue-600 uppercase tracking-wider">Nhấn để phát âm thanh phần nghe</p>
                 <p className="text-[10px] text-blue-400 font-bold">{activeSection.audio_url}</p>
              </div>
              <audio ref={audioRef} src={`/audio/${activeSection.audio_url}`} />
            </div>
          )}

          {/* Examples Container */}
          {activeSection.examples && activeSection.examples.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-50">
               {activeSection.examples.map((ex, i) => <div key={i}>{renderExample(ex, activeSection.type)}</div>)}
            </div>
          )}
        </div>

        {/* --- MAIN QUESTIONS CONTENT --- */}
        
        {/* TYPE 1: TRUE_FALSE (Listening P1, Reading P1) */}
        {(activeSection.type === 'LISTENING_P1' || activeSection.type === 'READING_P1') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSection.questions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] border-2 border-slate-100 p-4 flex items-center gap-4 hover:border-blue-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400">{q.id}.</div>
                <img src={`/images/${q.image_url}`} alt="Q" className="w-24 h-24 object-cover rounded-2xl border-2 border-slate-50" />
                <div className="flex-1 flex flex-col gap-2">
                   {["TRUE", "FALSE"].map(opt => (
                     <button
                        key={opt}
                        onClick={() => handleAnswerSection(idx, opt)}
                        className={`py-2 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                          userAnswers[idx] === opt
                            ? opt === 'TRUE' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-rose-500 border-rose-500 text-white'
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                        }`}
                     >
                       {opt === 'TRUE' ? '✓ Đúng' : '✗ Sai'}
                     </button>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TYPE 2: MATCH_IMAGE (Listening P2) */}
        {activeSection.type === 'LISTENING_P2' && (
          <div className="space-y-8">
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               {activeSection.gallery.map((item, i) => (
                 <div key={i} className="relative group rounded-3xl overflow-hidden border-4 border-white shadow-lg shadow-slate-200">
                    <img src={`/images/${item.image_url}`} alt={item.label} className="w-full h-auto aspect-square object-cover" />
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-white/90 backdrop-blur shadow-sm flex items-center justify-center font-black text-slate-800">{item.label}</div>
                 </div>
               ))}
            </div>
            {/* Questions Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
               {activeSection.questions.map((q, idx) => (
                 <div key={idx} className="bg-white rounded-[2rem] border-2 border-slate-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-xl font-black text-slate-800">{q.id}.</span>
                    <div className="flex flex-wrap justify-center gap-2">
                       {['A', 'B', 'C', 'D', 'E', 'F'].map(label => (
                         <button
                           key={label}
                           onClick={() => handleAnswerSection(idx, label)}
                           className={`w-12 h-12 rounded-2xl border-2 font-black transition-all ${
                             userAnswers[idx] === label 
                               ? 'bg-blue-500 border-blue-500 text-white scale-110 shadow-lg shadow-blue-500/20' 
                               : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                           }`}
                         >
                           {label}
                         </button>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* TYPE 3: MULTIPLE_CHOICE (Listening P3) */}
        {activeSection.type === 'LISTENING_P3' && (
          <div className="space-y-6">
            {activeSection.questions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 space-y-6">
                 <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">{q.id}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chọn đáp án đúng (A/B/C)</span>
                 </div>
                 <div className="grid grid-cols-1 gap-3">
                    {q.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerSection(idx, opt.label)}
                        className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center gap-6 group ${
                          userAnswers[idx] === opt.label 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' 
                            : 'bg-slate-50 border-transparent text-slate-800 hover:bg-white hover:border-blue-200'
                        }`}
                      >
                         <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${userAnswers[idx] === opt.label ? 'bg-white/20' : 'bg-white shadow-sm text-blue-500'}`}>{opt.label}</span>
                         <div className="flex-1">
                            <p className="text-xs font-bold opacity-60 mb-1">{opt.pinyin}</p>
                            <p className="text-2xl font-black">{opt.text}</p>
                            <p className={`text-sm font-medium mt-1 ${userAnswers[idx] === opt.label ? 'opacity-80' : 'text-slate-400'}`}>{opt.meaning}</p>
                         </div>
                      </button>
                    ))}
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* Float Submit */}
        <div className="fixed bottom-8 left-0 right-0 z-30 px-6 flex justify-center">
           <button 
             disabled={answeredCount < totalQuestions}
             onClick={() => setView('RESULT')}
             className={`px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl flex items-center gap-4 ${
               answeredCount < totalQuestions ? 'bg-white border-2 border-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600 hover:scale-105 shadow-blue-500/30'
             }`}
           >
             Nộp bài & Xem kết quả ✨
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
