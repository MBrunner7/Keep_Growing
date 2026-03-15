"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

// Partikel-Setup für die zufällige Sternen-Aura UM die Box herum
// (Zurück zur zufälligen Verteilung, aber weitläufiger)
const auraParticles = Array.from({ length: 24 }).map((_, i) => {
  // Zufällige Verteilung in einem großen, kreisförmigen Bereich um das Zentrum (0,0)
  // Wir nutzen Polarkoordinaten für eine kreisförmige Verteilung, aber mit zufälligem Radius
  const angle = Math.random() * 2 * Math.PI; // Zufälliger Winkel (0 bis 360 Grad)
  const maxRadiusX = 280; // Maximaler Radius X (breiter als die Box)
  const maxRadiusY = 220; // Maximaler Radius Y (höher als die Box)
  
  // Zufälliger Radius, damit sie nicht auf einer Linie liegen, sondern überall im Bereich
  const randomRadiusX = Math.random() * maxRadiusX; 
  const randomRadiusY = Math.random() * maxRadiusY; 

  return {
    id: i,
    x: Math.cos(angle) * randomRadiusX,
    y: Math.sin(angle) * randomRadiusY,
    // Alte, feine Größe: feine Sterne (0.5 bis 1.5)
    size: Math.random() * 1.0 + 0.5, 
    delay: Math.random() * 3,
  };
});

export default function TrainingsPage() {
  const [view, setView] = useState<'button' | 'menu' | 'player' | 'reward'>('button');
  const [trainings, setTrainings] = useState<any[]>([]);
  const [activeTraining, setActiveTraining] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [rewardFlower, setRewardFlower] = useState('🌸');
  
  const supabase = createClient();
  const flowers = ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '💐', '💠'];

  useEffect(() => {
    async function loadInitialData() {
      const { data } = await supabase.from('audio_trainings').select('*').order('id', { ascending: true });
      if (data) setTrainings(data);
      setLoading(false);
    }
    loadInitialData();
  }, []);

  const handleCompletion = async () => {
    const randomFlower = flowers[Math.floor(Math.random() * flowers.length)];
    setRewardFlower(randomFlower);

    const { data: { user } } = await supabase.auth.getUser();
    if (user && activeTraining) {
      await supabase.from('trainings_log').insert({
        user_id: user.id,
        training_type: activeTraining.training_type,
        completed_at: new Date().toISOString()
      });
    }
    setView('reward');
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#b57a84] font-bold tracking-widest uppercase text-xs">Lade Garten...</div>;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#fdfaf5]">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: "url('/beach-background.jpg')", opacity: view === 'button' ? 0.8 : 0.2 }} 
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 text-center">
        <AnimatePresence mode="wait">
          
          {/* ANSICHT 1: START BUTTON */}
          {view === 'button' && (
            <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.button
                className="relative z-20 flex items-center justify-center outline-none"
                whileTap="growing"
                onAnimationComplete={(def) => def === "growing" && setView('menu')}
              >
                <motion.div variants={{ growing: { scale: 60 } }} transition={{ duration: 3, ease: "easeIn" }} className="absolute z-0 w-10 h-10 rounded-full bg-[#b57a84]" />
                <motion.div variants={{ growing: { scale: 2.5, rotate: 15 } }} transition={{ duration: 3, ease: "easeInOut" }} className="relative z-10 text-9xl select-none">
                  🌸
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-[#4a4a4a] uppercase tracking-widest leading-tight">
                      Halten zum<br/>Wachsen
                    </span>
                  </div>
                </motion.div>
              </motion.button>
              <motion.p 
                className="absolute top-40 w-full left-0 text-white text-[10px] font-bold uppercase tracking-[0.4em] drop-shadow-md opacity-70"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Gedrückt halten zum Eintreten
              </motion.p>
            </motion.div>
          )}

          {/* ANSICHT 2: MENU */}
          {view === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white/95 backdrop-blur-xl rounded-[40px] p-8 shadow-2xl w-full max-w-md border border-white/40 flex flex-col items-center">
              <h2 className="font-[family-name:var(--font-cursive)] text-[#c5c1aa] text-5xl mb-8 lowercase text-center leading-tight">
                wähle dein training
              </h2>
              <div className="w-full space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar text-left">
                {trainings.length > 0 ? (
                  trainings.map((t) => (
                    <button key={t.id} onClick={() => { setActiveTraining(t); setView('player'); }} className="w-full bg-[#f2f2eb]/60 p-5 rounded-[25px] text-left hover:bg-white transition-all group flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 group-hover:text-[#b57a84] uppercase text-sm">{t.title}</h3>
                        <span className="text-[9px] bg-[#b57a84]/10 text-[#b57a84] px-2 py-0.5 rounded-full font-bold uppercase">{t.training_type}</span>
                      </div>
                      <div className="ml-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#b57a84]">▶</div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic py-10 text-center text-xs">Keine Trainings gefunden...</p>
                )}
              </div>
            </motion.div>
          )}

          {/* ANSICHT 3: PLAYER */}
          {view === 'player' && activeTraining && (
            <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full max-w-md px-4">
              <button 
                onClick={() => { 
                  if(audioRef.current) audioRef.current.pause(); 
                  setView('menu'); 
                }} 
                className="absolute top-10 right-10 text-gray-800/50 hover:text-gray-800 text-3xl transition-colors"
              >
                ✕
              </button>
              
              <motion.div animate={isPlaying ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 4, repeat: Infinity }} className="w-48 h-48 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mb-10 border border-white/30 shadow-xl">
                <div className={`text-7xl transition-all duration-1000 ${isPlaying ? 'rotate-12' : 'rotate-0'}`}>🌸</div>
              </motion.div>

              <h4 className="text-[#b57a84] text-[10px] font-bold uppercase tracking-[0.5em] mb-4 bg-white/80 px-4 py-1 rounded-full shadow-sm">
                {activeTraining.training_type}
              </h4>
              
              <h3 className="text-3xl font-light text-[#4a4a4a] italic mb-10 leading-relaxed px-4">
                "{activeTraining.title}"
              </h3>

              <div className="w-full bg-white/90 backdrop-blur-md rounded-[30px] p-6 shadow-xl border border-white/50">
                <div className="flex items-center gap-5">
                  <button 
                    onClick={togglePlay} 
                    className="w-14 h-14 flex items-center justify-center bg-[#b57a84] text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
                  >
                    {isPlaying ? <span className="text-xl">❚❚</span> : <span className="text-2xl ml-1">▶</span>}
                  </button>

                  <div className="flex-1 flex flex-col gap-2">
                    <input 
                      type="range" 
                      min="0" 
                      max={duration || 100} 
                      value={currentTime} 
                      onChange={handleSeek}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#b57a84] hover:h-3 transition-all"
                      style={{
                        backgroundImage: `linear-gradient(to right, #b57a84 ${(currentTime / (duration || 1)) * 100}%, #e5e7eb 0%)`
                      }}
                    />
                    <div className="flex justify-between text-[11px] font-bold text-gray-500 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <audio 
                ref={audioRef}
                src={activeTraining.audio_url}
                autoPlay
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={handleCompletion}
              />
            </motion.div>
          )}

          {/* ANSICHT 4: REWARD SCREEN */}
          {view === 'reward' && (
            <div className="flex items-center justify-center relative w-full max-w-6xl">
              
              {/* Bereich für Schmetterlinge (Größer & weiter links) */}
              <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 flex flex-col gap-4 items-center z-10 p-4">
                {/* Schmetterling 1: Gerade nach oben, sehr groß */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1.4, // Noch größer (ca. 40%)
                    y: [0, -15, 0],
                    rotate: 0
                  }}
                  transition={{ 
                    opacity: { delay: 0.5, duration: 1 },
                    scale: { delay: 0.5, type: "spring" },
                    y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                  }}
                  className="text-6xl filter drop-shadow-xl mb-4"
                >
                  🦋
                </motion.div>

                {/* Schmetterling 2: Daneben & geneigt, groß */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1.1, // Größer als vorher
                    x: 30,
                    y: [10, 25, 10],
                    rotate: -25
                  }}
                  transition={{ 
                    opacity: { delay: 0.8, duration: 1 },
                    scale: { delay: 0.8, type: "spring" },
                    y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
                  }}
                  className="text-5xl filter drop-shadow-xl"
                >
                  🦋
                </motion.div>
              </div>

              {/* Der zentrale Belohnungsbereich */}
              <div className="flex flex-col items-center relative z-20">
                
                {/* Sternenglitzer-Aura - zufällig UM die Box herum verteilt */}
                <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {auraParticles.map((p) => (
                      <motion.div
                        key={`aura-${p.id}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          // Alte, feine Größe reaktiviert
                          opacity: [0, 1, 0.8, 0],
                          scale: [0, p.size, p.size * 0.8, 0],
                          rotate: [0, 180, 360],
                          x: [p.x, p.x + (Math.random() * 30 - 15)], // Sanfte radiale Bewegung
                          y: [p.y, p.y + (Math.random() * 30 - 15)]
                        }}
                        transition={{ 
                          delay: p.delay,
                          duration: 2.5 + Math.random(),
                          repeat: Infinity,
                          repeatDelay: 0.5
                        }}
                        className="absolute text-yellow-300 filter drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                        style={{ fontSize: `${p.size * 10}px` }} // Feine Skalierung
                      >
                        ✨
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Die Box leicht nach oben geschoben */}
                <motion.div 
                  key="reward-box" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: -40 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="bg-white/95 p-10 rounded-[50px] text-center shadow-2xl max-w-sm border border-white/40 z-20 relative"
                >
                  <h2 className="text-gray-800 font-bold text-2xl mb-2 italic">Wunderschön!</h2>
                  <p className="text-gray-600 font-medium text-lg mb-8 leading-relaxed">
                    Du hast eine neue Blume für deinen Garten erhalten.
                  </p>
                  
                  <Link href="/" className="inline-block bg-[#b57a84] text-white px-10 py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] shadow-lg hover:bg-[#a36973] transition-colors">
                    Zurück zum Garten
                  </Link>
                </motion.div>

                {/* Die Blume separat unter der Box */}
                <motion.div 
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1.2, y: 0 }}
                  transition={{ 
                    delay: 0.6,
                    type: "spring", 
                    damping: 10, 
                    stiffness: 80 
                  }}
                  className="text-9xl mt-6 select-none filter drop-shadow-2xl z-10"
                >
                  {rewardFlower}
                </motion.div>
              </div>
            </div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}