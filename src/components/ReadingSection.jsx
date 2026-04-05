import React, { useState, useRef, useEffect } from 'react';
import readingData from '../data/readingData.json';

const ReadingSection = ({ levelId, lessonId, showTranslation: globalShowTranslation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [localShowTranslation, setLocalShowTranslation] = useState(false);
  const audioRef = useRef(null);

  // Find the reading text for the current level and lesson
  const levelData = readingData[levelId];
  const lessonReading = levelData?.find(l => l.lessonId === lessonId);

  // Sync translation toggle with global state if provided, or use local
  const showTrans = globalShowTranslation || localShowTranslation;

  const toggleAudio = (audioFile) => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Use the public audio path
      audioRef.current.src = `/audio/${audioFile}`;
      audioRef.current.play().catch(e => {
        console.error("Audio play error:", e);
        alert("Không tìm thấy file âm thanh. Vui lòng kiểm tra thư mục public/audio/");
      });
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  if (!lessonReading) {
    return (
      <div className="text-center py-20 text-slate-300 italic rounded-3xl border-2 border-dashed border-slate-100">
        Nội dung bài khóa cho bài này đang được cập nhật...
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <audio ref={audioRef} className="hidden" />
      
      <div className="flex flex-col gap-10">
        {lessonReading.sections.map((section, sIdx) => (
          <div key={section.id} className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 font-bold">
                  {sIdx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{section.location}</h3>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Reading Text {section.id}</p>
                </div>
              </div>
              
              <button 
                onClick={() => toggleAudio(section.audio)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isPlaying ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white hover:scale-110 active:scale-95'
                }`}
                title={isPlaying ? "Dừng" : "Nghe bài khóa"}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
            </div>

            {/* Reading Content Area */}
            <div className="space-y-8 mb-10">
              {section.content.map((line, lIdx) => (
                <div key={lIdx} className={`flex gap-4 ${line.speaker === 'B' ? 'flex-row-reverse text-right' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-2 ${
                    line.speaker === 'A' ? 'bg-slate-100 text-slate-400' : 'bg-blue-500 text-white'
                  }`}>
                    {line.speaker}
                  </div>
                  
                  <div className={`flex flex-wrap gap-x-2 gap-y-4 max-w-[85%] ${line.speaker === 'B' ? 'justify-end' : ''}`}>
                    {line.blocks.map((block, bIdx) => (
                      <ruby key={bIdx} className="ruby-text text-3xl md:text-4xl font-bold text-slate-800 leading-[3rem]">
                        {block.h}
                        <rt className="text-sm md:text-base text-blue-500 font-medium pb-1 select-none">
                          {block.p}
                        </rt>
                      </ruby>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Translation Modal/Area */}
            <div className="pt-8 border-t border-slate-50">
              <button 
                onClick={() => setLocalShowTranslation(!localShowTranslation)}
                className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] hover:text-blue-500 transition-colors flex items-center gap-2 mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                Dịch nghĩa
              </button>
              
              {showTrans && (
                <div className="bg-slate-50 px-8 py-6 rounded-2xl animate-in slide-in-from-top-2 duration-500">
                  <p className="text-slate-600 leading-relaxed italic whitespace-pre-line">
                    {section.translation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadingSection;
