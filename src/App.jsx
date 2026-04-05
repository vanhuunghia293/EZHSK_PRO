import React, { useState, useEffect } from 'react';
import hskData from './data/hsks.json';
import readingData from './data/readingData.json';
import ReadingSection from './components/ReadingSection';
import ExerciseSection from './components/ExerciseSection';
import { pinyin } from 'pinyin-pro';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg border border-red-100">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Đã có lỗi xảy ra.</h1>
            <p className="text-slate-600 mb-6">Ứng dụng gặp sự cố kỹ thuật. Vui lòng chụp ảnh màn hình này và gửi cho chúng tôi.</p>
            <div className="bg-slate-50 p-4 rounded-xl text-left overflow-auto max-h-48 mb-6 border border-slate-200">
              <pre className="text-xs text-red-500 font-mono italic whitespace-pre-wrap">
                {this.state.error?.toString()}
              </pre>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
            >
              Tải lại ứng dụng
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log("App Component: Rendering...");

const App = () => {
  const [currentLevelId, setCurrentLevelId] = useState('HSK 1');
  const [currentLessonId, setCurrentLessonId] = useState(1);
  const [activeTab, setActiveTab] = useState('VOCAB'); // VOCAB, GRAMMAR, READING, EXERCISE
  const [showTranslation, setShowTranslation] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Robust data check
  const levels = hskData?.levels || [];
  const levelData = levels.find(l => l.id === currentLevelId) || levels[0];
  const lessonData = levelData?.lessons?.find(l => l.lessonId === currentLessonId) || levelData?.lessons?.[0];

  const speak = (text) => {
    try {
      if (!text || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const cleanText = text.toString().replace(/\s*\(.*?\)\s*/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech error:", e);
    }
  };

  const safePinyin = (text) => {
    try {
      if (!text) return "";
      return pinyin(text);
    } catch (e) {
      console.warn("Pinyin error:", e);
      return "";
    }
  };

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-4 text-sm font-medium transition-all border-b-2 outline-none ${
        activeTab === id 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      {label}
    </button>
  );

  const SpeakerIcon = ({ text, className = "w-5 h-5" }) => (
    <button 
      onClick={(e) => { e.stopPropagation(); speak(text); }}
      className={`text-slate-300 hover:text-blue-500 transition-colors p-1 ${className}`}
      title="Nghe phát âm"
    >
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#fdfdfd] text-slate-900 font-['Outfit']">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="mb-12">
            <h1 className="text-3xl font-bold tracking-tighter text-blue-600">EZHSK</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium tracking-widest uppercase">Premium Learning</p>
          </div>

          <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar">
            {hskData?.levels?.map(level => (
              <div key={level.id}>
                <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">{level.id}</h3>
                <div className="space-y-1">
                  {level.lessons.map(lesson => (
                    <button
                      key={lesson.lessonId}
                      onClick={() => {
                        setCurrentLevelId(level.id);
                        setCurrentLessonId(lesson.lessonId);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                        currentLevelId === level.id && currentLessonId === lesson.lessonId
                          ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm shadow-blue-100/50'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                    >
                      Bài {lesson.lessonId}: {lesson.lessonTitle}
                    </button>
                  ))}
                  {level.lessons.length === 0 && <p className="px-4 text-xs text-slate-300 italic">Đang cập nhật...</p>}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Bản dịch (VN)</span>
              <button 
                onClick={() => setShowTranslation(!showTranslation)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${showTranslation ? 'bg-blue-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${showTranslation ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header - Mobile */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="font-bold text-blue-600 tracking-tight">EZHSK</span>
          <div className="w-6" />
        </header>

        {/* Lesson Hero */}
        <div className="px-6 pt-12 lg:pt-20 pb-8 max-w-5xl mx-auto w-full">
          <div className="mb-4">
            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded uppercase tracking-widest">{currentLevelId}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-2">
            Bài {currentLessonId}: {lessonData?.lessonTitle}
          </h2>
          <p className="text-slate-400 text-lg">Học tập trung, không xao nhãng.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 sticky top-0 lg:top-0 bg-[#fdfdfd] z-30 border-b border-slate-100">
          <div className="max-w-5xl mx-auto flex overflow-x-auto no-scrollbar">
            <TabButton id="VOCAB" label="Từ vựng" />
            <TabButton id="GRAMMAR" label="Ngữ pháp" />
            <TabButton id="READING" label="Bài khóa" />
            <TabButton id="EXERCISE" label="Bài tập" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
          {activeTab === 'VOCAB' && (
            <div className="space-y-6">
              {lessonData?.vocabulary?.length > 0 ? (
                lessonData.vocabulary.map((v, i) => (
                  <div key={i} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Left Content Area */}
                      <div className="flex-1 space-y-6">
                        {/* Top Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-50/80">
                          <div className="flex items-center gap-8">
                            <div className="text-7xl font-bold tracking-tighter text-slate-800">{v.hanzi}</div>
                            <div className="space-y-1.5">
                              <div className="text-2xl font-bold text-blue-500">{v.pinyin}</div>
                              <div className="text-lg text-slate-600 font-medium">{v.meaning}</div>
                            </div>
                          </div>
                          <div>
                            <SpeakerIcon text={v.hanzi} className="w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white shadow-sm" />
                          </div>
                        </div>
                        
                        {/* Bottom Section */}
                        <div className={`pt-6 grid grid-cols-1 md:grid-cols-12 gap-4`}>
                          {/* Example Block */}
                          <div className={`bg-slate-50/80 p-5 rounded-2xl ${v.analysis || v.visualContext ? 'md:col-span-12 lg:col-span-4' : 'md:col-span-12'}`}>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Ví dụ</span>
                            {(() => {
                              const match = (v.example || "").match(/^(.*?)(?:\s*\((.*?)\)\s*)?$/);
                              const chinese = match ? match[1].trim() : v.example;
                              const meaning = match && match[2] ? match[2].trim() : "";
                              const pinyinText = chinese ? safePinyin(chinese) : "";
                              return (
                                <div className="space-y-1">
                                  <p className="text-slate-800 text-lg font-medium leading-relaxed">{chinese}</p>
                                  {pinyinText && <p className="text-blue-500 font-medium text-sm mb-1">{pinyinText}</p>}
                                  {meaning && <p className="text-slate-500 italic text-base leading-relaxed">{meaning}</p>}
                                </div>
                              );
                            })()}
                          </div>
                          
                          {/* Analysis Block */}
                          {v.analysis && (
                            <div className="bg-blue-50/50 border border-blue-100/50 p-5 rounded-2xl md:col-span-6 lg:col-span-4">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block">Phân tích</span>
                              </div>
                              <p className="text-slate-700 leading-relaxed text-sm">{v.analysis}</p>
                            </div>
                          )}

                          {/* Visual Context Block */}
                          {v.visualContext && !v.image && (
                            <div className="bg-emerald-50/50 border border-emerald-100/50 p-5 rounded-2xl md:col-span-6 lg:col-span-4">
                              <div className="flex items-center gap-2 mb-2">
                                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block">Gợi ý hình ảnh</span>
                              </div>
                              <p className="text-slate-700 leading-relaxed text-sm">{v.visualContext}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Image Area */}
                      {v.image && (
                        <div className="w-full lg:w-1/3 xl:w-2/5 flex-shrink-0">
                          <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/20 aspect-[4/3] bg-slate-50 relative group/img">
                            <img src={v.image} alt={v.meaning} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
                            {v.visualContext && (
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent p-5 pt-16">
                                <p className="text-white text-sm font-medium leading-relaxed drop-shadow-md">{v.visualContext}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-slate-300 italic">Dữ liệu từ vựng đang được cập nhật...</div>
              )}
            </div>
          )}

          {activeTab === 'GRAMMAR' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lessonData?.grammar?.length > 0 ? (
                lessonData.grammar.map((g, i) => (
                  <div key={i} className="bg-white p-10 rounded-[2rem] border border-slate-100 flex flex-col gap-6">
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Cấu trúc #{i + 1}</span>
                      <h3 className="text-2xl font-bold tracking-tight">{g.title}</h3>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl font-mono text-sm text-slate-700 border border-slate-100">
                      {g.formula}
                    </div>
                    <p className="text-slate-500 leading-relaxed">{g.explanation}</p>
                    <div className="mt-4 pt-6 border-t border-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Ví dụ</span>
                        <SpeakerIcon text={g.example} />
                      </div>
                      <p className="text-xl font-medium text-slate-800">{g.example}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-slate-300 italic">Dữ liệu ngữ pháp đang được cập nhật...</div>
              )}
            </div>
          )}

          {activeTab === 'READING' && (
            <div className="max-w-4xl mx-auto">
              <ReadingSection 
                levelId={currentLevelId} 
                lessonId={currentLessonId} 
                showTranslation={showTranslation} 
              />
            </div>
          )}

          {activeTab === 'EXERCISE' && (
            <div className="max-w-5xl mx-auto">
              <ExerciseSection levelId={currentLevelId} />
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="py-16 text-center border-t border-slate-50 mt-12">
          <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.4em]">EZHSK • Minimalist Academy</p>
        </footer>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const RootApp = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default RootApp;
