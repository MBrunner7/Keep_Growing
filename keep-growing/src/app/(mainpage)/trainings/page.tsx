"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Partikel-Setup für die zufällige Sternen-Aura
const auraParticles = Array.from({ length: 24 }).map((_, i) => {
  const angle = Math.random() * 2 * Math.PI;
  const maxRadiusX = 280;
  const maxRadiusY = 220;

  const randomRadiusX = Math.random() * maxRadiusX;
  const randomRadiusY = Math.random() * maxRadiusY;

  return {
    id: i,
    x: Math.cos(angle) * randomRadiusX,
    y: Math.sin(angle) * randomRadiusY,
    size: Math.random() * 1.0 + 0.5,
    delay: Math.random() * 3,
  };
});

// Mapping der Trainings-Kategorien auf die neuen Flower-Types
const FLOWER_MAPPING: Record<string, string> = {
  meditation: "creativityWarmth",
  atemübung: "imaginativeTraining",
  selbstliebe: "innerPeace",
  entspannung: "selfEmpowerment",
  energie: "creativityWarmth", // Fallback/Zusatz
};

// Emojis für die Anzeige im Reward-Screen (bis die Bilder final eingebunden sind)
const FLOWER_EMOJIS: Record<string, string> = {
  creativityWarmth: "🌸",
  imaginativeTraining: "🌺",
  innerPeace: "🌻",
  selfEmpowerment: "🌷",
};

export default function TrainingsPage() {
  const [view, setView] = useState<"menu" | "growth" | "player" | "reward">(
    "menu",
  );
  const [trainings, setTrainings] = useState<any[]>([]);
  const [activeTraining, setActiveTraining] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [rewardFlower, setRewardFlower] = useState("🌸");

  const supabase = createClient();

  useEffect(() => {
    async function loadInitialData() {
      const { data } = await supabase
        .from("audio_trainings")
        .select("*")
        .order("id", { ascending: true });
      if (data) setTrainings(data);
      setLoading(false);
    }
    loadInitialData();
  }, []);

  const handleCompletion = async () => {
    const typeKey =
      activeTraining?.training_type?.toLowerCase() || "meditation";
    const assignedFlowerType = FLOWER_MAPPING[typeKey] || "innerPeace";

    setRewardFlower(FLOWER_EMOJIS[assignedFlowerType] || "🌸");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && activeTraining) {
      await supabase.from("trainings_log").insert({
        user_id: user.id,
        training_type: activeTraining.training_type,
        completed_at: new Date().toISOString(),
      });

      localStorage.setItem("selectedFlower", assignedFlowerType);
    }

    setView("reward");
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
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#b57a84] font-bold tracking-widest uppercase text-xs">
        Lade Garten...
      </div>
    );

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#fdfaf5]">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: "url('/beach-background.jpg')",
          opacity: view === "menu" ? 0.8 : 0.2,
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 text-center">
        <AnimatePresence mode="wait">
          {view === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="relative bg-white/95 backdrop-blur-xl rounded-[50px] p-10 shadow-2xl w-full max-w-2xl border border-white/40 flex flex-col items-center"
            >
              <Link
                href="/"
                className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center rounded-[15px] bg-white border border-gray-100 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-[#b57a84]"
                >
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
              </Link>

              <h2 className="font-[family-name:var(--font-cursive)] text-[#c5c1aa] text-4xl mb-10 lowercase text-center leading-[1.3] px-6 mt-4">
                wähle heute dein autogenes training <br /> und lass deinen geist
                wachsen
              </h2>

              <div className="w-full max-w-md space-y-4 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar text-left">
                {trainings.length > 0 ? (
                  trainings.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTraining(t);
                        setView("growth");
                      }}
                      className="w-full bg-[#f2f2eb]/60 p-5 rounded-[25px] text-left hover:bg-white transition-all group flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 group-hover:text-[#b57a84] uppercase text-sm">
                          {t.title}
                        </h3>
                        <span className="text-[9px] bg-[#b57a84]/10 text-[#b57a84] px-2 py-0.5 rounded-full font-bold uppercase">
                          {t.training_type}
                        </span>
                      </div>
                      <div className="ml-4 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#b57a84]">
                        ▶
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm italic py-10 text-center text-xs">
                    Keine Trainings gefunden...
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {view === "growth" && activeTraining && (
            <motion.div
              key="growth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                className="relative z-20 flex items-center justify-center outline-none"
                whileTap="growing"
                onAnimationComplete={(def) =>
                  def === "growing" && setView("player")
                }
              >
                <motion.div
                  variants={{ growing: { scale: 60 } }}
                  transition={{ duration: 3, ease: "easeIn" }}
                  className="absolute z-0 w-10 h-10 rounded-full bg-[#b57a84]"
                />
                <motion.div
                  variants={{ growing: { scale: 2.5, rotate: 15 } }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="relative z-10 text-9xl select-none"
                >
                  🌸
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-[#4a4a4a] uppercase tracking-widest leading-tight">
                      Halten zum
                      <br />
                      Starten
                    </span>
                  </div>
                </motion.div>
              </motion.button>
              <motion.p
                className="absolute top-40 w-full left-0 text-white text-[10px] font-bold uppercase tracking-[0.4em] drop-shadow-md opacity-70"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Gedrückt halten für: {activeTraining.title}
              </motion.p>
            </motion.div>
          )}

          {view === "player" && activeTraining && (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center w-full max-w-md px-4"
            >
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setView("menu");
                }}
                className="absolute top-10 right-10 text-gray-800/50 hover:text-gray-800 text-3xl transition-colors"
              >
                ✕
              </button>

              <motion.div
                animate={
                  isPlaying ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}
                }
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-44 h-44 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30 shadow-xl"
              >
                <div className="text-7xl select-none">🌸</div>
              </motion.div>

              <h4 className="text-[#b57a84] text-[10px] font-bold uppercase tracking-[0.5em] mb-2 bg-white/80 px-4 py-1 rounded-full shadow-sm">
                {activeTraining.training_type}
              </h4>

              <h3 className="text-2xl font-light text-[#4a4a4a] italic mb-6 leading-relaxed px-4">
                "{activeTraining.title}"
              </h3>

              <div className="w-full mb-8 px-4 max-h-[120px] overflow-y-auto custom-scrollbar">
                <p className="text-[#4a4a4a]/70 text-sm leading-relaxed font-medium italic">
                  {activeTraining.description ||
                    "Atme tief ein und aus... Lass alle Anspannung los und konzentriere dich ganz auf den Moment."}
                </p>
              </div>

              <div className="w-full bg-white/90 backdrop-blur-md rounded-[30px] p-6 shadow-xl border border-white/50">
                <div className="flex items-center gap-5">
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 flex items-center justify-center bg-[#b57a84] text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
                  >
                    {isPlaying ? (
                      <span className="text-xl">❚❚</span>
                    ) : (
                      <span className="text-2xl ml-1">▶</span>
                    )}
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
                        backgroundImage: `linear-gradient(to right, #b57a84 ${(currentTime / (duration || 1)) * 100}%, #e5e7eb 0%)`,
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
                onTimeUpdate={(e) =>
                  setCurrentTime(e.currentTarget.currentTime)
                }
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={handleCompletion}
              />
            </motion.div>
          )}

          {view === "reward" && (
            <div className="flex items-center justify-center relative w-full max-w-6xl">
              <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 flex flex-col gap-4 items-center z-10 p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1.4, y: [0, -15, 0] }}
                  transition={{
                    opacity: { delay: 0.5, duration: 1 },
                    scale: { delay: 0.5, type: "spring" },
                    y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  }}
                  className="text-6xl filter drop-shadow-xl mb-4"
                >
                  🦋
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1.1,
                    x: 30,
                    y: [10, 25, 10],
                    rotate: -25,
                  }}
                  transition={{
                    opacity: { delay: 0.8, duration: 1 },
                    scale: { delay: 0.8, type: "spring" },
                    y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                  }}
                  className="text-5xl filter drop-shadow-xl"
                >
                  🦋
                </motion.div>
              </div>

              <div className="flex flex-col items-center relative z-20">
                <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {auraParticles.map((p) => (
                      <motion.div
                        key={`aura-${p.id}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0.8, 0],
                          scale: [0, p.size, p.size * 0.8, 0],
                          rotate: [0, 180, 360],
                          x: [p.x, p.x + (Math.random() * 30 - 15)],
                          y: [p.y, p.y + (Math.random() * 30 - 15)],
                        }}
                        transition={{
                          delay: p.delay,
                          duration: 2.5 + Math.random(),
                          repeat: Infinity,
                          repeatDelay: 0.5,
                        }}
                        className="absolute text-yellow-300 filter drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                        style={{ fontSize: `${p.size * 10}px` }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  key="reward-box"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: -40 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="bg-white/95 p-10 rounded-[50px] text-center shadow-2xl max-w-md border border-white/40 z-20 relative"
                >
                  <h2 className="text-gray-800 font-bold text-2xl mb-2 italic">
                    Wunderschön!
                  </h2>
                  <p className="text-gray-600 font-medium text-lg mb-8 leading-relaxed">
                    Du hast eine neue Blume für deinen Garten erhalten.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                      href="/blumengarten"
                      className="inline-block bg-[#b57a84] text-white px-8 py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-[#a36973] transition-colors whitespace-nowrap"
                    >
                      Zum Blumengarten
                    </Link>
                    <Link
                      href="/"
                      className="inline-block bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] shadow-md hover:bg-gray-300 transition-colors whitespace-nowrap"
                    >
                      Zur Startseite
                    </Link>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1.2, y: 0 }}
                  transition={{
                    delay: 0.6,
                    type: "spring",
                    damping: 10,
                    stiffness: 80,
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

      <div className="fixed bottom-10 left-0 w-full z-50 flex justify-center pointer-events-none">
        <Link
          href="/impressum"
          className="text-[#6b6b6b] text-sm font-medium tracking-widest underline decoration-1 underline-offset-4 hover:text-[#2a2a2a] hover:decoration-2 hover:scale-105 transition-all duration-300 pointer-events-auto"
        >
          About us
        </Link>
      </div>
    </main>
  );
}