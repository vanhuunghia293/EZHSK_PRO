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

  const handleSpeak = (text) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

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
          <p className="text-slate-400 font-medium tracking-wide">Luyện tập kỹ năng Nghe và Đọc hiểu chuẩn giáo trình</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 hover:border-blue-200 transition-all shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 group">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl group-hover:rotate-12 transition-all">
                  {lesson.id}
                </div>
                <h3 className="text-2xl font-black text-slate-800">{lesson.title}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {lesson.sections.map((section, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => startExercise(lesson, section)}
                    className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-slate-50 hover:bg-blue-600 group/btn transition-all duration-300 active:scale-95 border-2 border-transparent hover:border-blue-400"
                  >
                    <span className="text-3xl mb-1">{section.type.includes('LISTENING') ? '🎧' : '📖'}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover/btn:text-white transition-colors">
                      {section.type.includes('LISTENING') ? 'Luyện Nghe' : 'Luyện Đọc'}
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
      return (
        <div className="bg-slate-50/50 p-6 rounded-3xl border-2 border-dashed border-slate-200 opacity-80 group/ex">
           <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">Ví dụ</span>
              {ex.text && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nhấn vào chữ để nghe đọc</span>}
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-8">
              {ex.image_url && (
                <div className="w-full md:w-48 aspect-video md:aspect-square rounded-2xl overflow-hidden bg-white border shadow-sm">
                   <img src={`/images/${ex.image_url}`} alt="Ex" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="flex-1 space-y-4 text-center md:text-left">
                 {ex.text && (
                   <div onClick={() => handleSpeak(ex.text)} className="cursor-pointer group/text inline-block">
                      <p className="text-sm font-bold text-blue-500 mb-1 opacity-0 group-hover/text:opacity-100 transition-opacity uppercase tracking-tighter">{ex.pinyin}</p>
                      <p className="text-4xl font-black text-slate-800 hover:text-blue-600 transition-colors tracking-tight">{ex.text}</p>
                      <p className="text-xs font-medium text-slate-400 mt-2">{ex.meaning}</p>
                   </div>
                 )}
                 <div className="flex gap-4 justify-center md:justify-start">
                    <div className={`px-6 py-2 rounded-xl font-black text-xs border-2 transition-all ${ex.correct_answer === 'TRUE' || type === 'LISTENING_P2' && ex.correct_answer === 'D' ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-100 text-slate-300'}`}>✓ Đúng {type === 'LISTENING_P2' && `(D)`}</div>
                    {(type === 'LISTENING_P1' || type === 'READING_P1') && <div className={`px-6 py-2 rounded-xl font-black text-xs border-2 transition-all ${ex.correct_answer === 'FALSE' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-slate-100 text-slate-300'}`}>✗ Sai</div>}
                 </div>
              </div>
           </div>
        </div>
      );
    };

    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-40">
        {/* Header */}
        <div className="sticky top-4 z-40 bg-white/90 backdrop-blur-2xl border-2 border-slate-100 rounded-[2.5rem] p-5 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button onClick={() => setView('LIST')} className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-slate-900/20 text-xl font-bold">←</button>
            <div>
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-[0.1em]">{activeLesson.title}</h3>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{activeSection.type.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="flex items-center gap-8 w-full md:w-auto">
            <div className="flex-1 md:w-64 h-3 bg-slate-100 rounded-full overflow-hidden border">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-black text-slate-900 whitespace-nowrap tracking-widest uppercase">
              {answeredCount}<span className="text-slate-300 mx-1">/</span>{totalQuestions}
            </span>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white rounded-[3rem] border-2 border-slate-100 p-10 shadow-xl shadow-slate-200/20 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 -z-0 opacity-50" />
          <div className="space-y-3 relative z-10">
            <h4 className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">{activeSection.title}</h4>
            <h2 className="text-3xl font-black text-slate-900 leading-tight max-w-2xl">{activeSection.instruction}</h2>
          </div>

          {/* Audio Player */}
          {activeSection.audio_url && (
            <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[2.5rem] border-2 border-blue-100/50 relative z-10 shadow-inner">
              <button 
                onClick={() => audioRef.current.play()}
                className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all group"
              >
                <span className="group-hover:scale-125 transition-transform">▶️</span>
              </button>
              <div className="flex-1">
                 <p className="text-xs font-black text-blue-800 uppercase tracking-widest mb-1">Âm thanh chính thức</p>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">{activeSection.audio_url}</p>
                 </div>
              </div>
              <audio ref={audioRef} src={`/audio/${activeSection.audio_url}`} />
            </div>
          )}

          {/* Examples Container */}
          {activeSection.examples && activeSection.examples.length > 0 && (
            <div className="space-y-6 pt-8 border-t-2 border-slate-50 relative z-10">
               {activeSection.examples.map((ex, i) => <div key={i}>{renderExample(ex, activeSection.type)}</div>)}
            </div>
          )}
        </div>

        {/* --- MAIN QUESTIONS CONTENT --- */}
        
        {/* TYPE 1: TRUE_FALSE (Listening P1, Reading P1) */}
        {(activeSection.type === 'LISTENING_P1' || activeSection.type === 'READING_P1') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeSection.questions.map((q, idx) => (
              <div key={idx} className={`bg-white rounded-[2.5rem] border-2 p-6 space-y-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 group ${userAnswers[idx] ? 'border-blue-100 bg-blue-50/5' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between">
                   <span className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-sm font-black text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">{q.id}</span>
                   {userAnswers[idx] && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Đã chọn</span>}
                </div>

                <div className="space-y-6 flex flex-col items-center">
                   <div className="w-full aspect-square sm:w-64 sm:h-64 rounded-[2rem] overflow-hidden bg-slate-50 border-4 border-white shadow-xl shadow-slate-200/50 group-hover:scale-105 transition-transform duration-700">
                      <img src={`/images/${q.image_url}`} alt="Q" className="w-full h-full object-cover" />
                   </div>
                   
                   {q.text && (
                     <div onClick={() => handleSpeak(q.text)} className="text-center cursor-pointer group/qtxt px-4">
                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1 opacity-0 group-hover/qtxt:opacity-100 transition-opacity">{q.pinyin}</p>
                        <p className="text-4xl font-black text-slate-800 tracking-tight hover:text-blue-600 transition-colors">{q.text}</p>
                        <p className="text-xs font-bold text-slate-400 mt-2">{q.meaning}</p>
                     </div>
                   )}
                </div>

                <div className="flex gap-4">
                   {["TRUE", "FALSE"].map(opt => (
                     <button
                        key={opt}
                        onClick={() => handleAnswerSection(idx, opt)}
                        className={`flex-1 py-5 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                          userAnswers[idx] === opt
                            ? opt === 'TRUE' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                            : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'
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
          <div className="space-y-12">
            {/* Gallery Grid - MUCH LARGER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {activeSection.gallery.map((item, i) => (
                 <div key={i} className="relative group rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl shadow-slate-200 hover:scale-105 transition-transform duration-500">
                    <img src={`/images/${item.image_url}`} alt={item.label} className="w-full h-auto aspect-square object-cover" />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/95 backdrop-blur shadow-xl flex items-center justify-center font-black text-2xl text-slate-900 border border-slate-100">{item.label}</div>
                 </div>
               ))}
            </div>
            {/* Questions Inputs */}
            <div className="grid grid-cols-1 gap-6">
               {activeSection.questions.map((q, idx) => (
                 <div key={idx} className={`bg-white rounded-[3rem] border-2 p-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-500 ${userAnswers[idx] ? 'border-blue-200 bg-blue-50/10' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-6">
                       <span className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-xl">{q.id}</span>
                       <span className="text-sm font-black text-slate-400 uppercase tracking-widest hidden md:block">Chọn tranh tương ứng</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                       {['A', 'B', 'C', 'D', 'E', 'F'].map(label => (
                         <button
                           key={label}
                           onClick={() => handleAnswerSection(idx, label)}
                           className={`w-16 h-16 rounded-2xl border-2 font-black text-xl transition-all duration-300 ${
                             userAnswers[idx] === label 
                               ? 'bg-blue-600 border-blue-600 text-white scale-125 shadow-2xl shadow-blue-500/40 z-10' 
                               : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'
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
          <div className="space-y-8">
            {activeSection.questions.map((q, idx) => (
              <div key={idx} className={`bg-white rounded-[3rem] border-2 p-10 space-y-10 transition-all duration-500 ${userAnswers[idx] ? 'border-blue-100' : 'border-slate-100'}`}>
                 <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg">{q.id}</span>
                    <span className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Chọn đáp án</span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {q.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          handleAnswerSection(idx, opt.label);
                          handleSpeak(opt.text);
                        }}
                        className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 group/btn ${
                          userAnswers[idx] === opt.label 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/30' 
                            : 'bg-slate-50 border-transparent text-slate-800 hover:bg-white hover:border-blue-200'
                        }`}
                      >
                         <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl mb-2 ${userAnswers[idx] === opt.label ? 'bg-white/20' : 'bg-white shadow-sm text-blue-600'}`}>{opt.label}</span>
                         <div className="text-center">
                            <p className="text-[10px] font-black opacity-50 mb-1 uppercase tracking-widest">{opt.pinyin}</p>
                            <p className="text-3xl font-black mb-2">{opt.text}</p>
                            <p className={`text-xs font-bold ${userAnswers[idx] === opt.label ? 'opacity-80' : 'text-slate-400'}`}>{opt.meaning}</p>
                         </div>
                      </button>
                    ))}
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* Float Submit */}
        <div className="fixed bottom-10 left-0 right-0 z-50 px-6 flex justify-center">
           <button 
             disabled={answeredCount < totalQuestions}
             onClick={() => setView('RESULT')}
             className={`px-16 py-6 rounded-full font-black text-sm uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl flex items-center gap-4 border-4 border-white ${
               answeredCount < totalQuestions ? 'bg-white/90 backdrop-blur text-slate-300 cursor-not-allowed border-slate-100' : 'bg-slate-900 text-white hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-blue-500/30'
             }`}
           >
             <span>Nộp bài & Xem kết quả</span>
             <span className="text-xl">🚀</span>
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
