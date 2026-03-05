import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { saveDailyEntry } from '@/app/actions';

/**
 * Hilfsfunktion für die ISO-Kalenderwoche
 */
function getISOWeek(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Holt Trainingsdaten für die letzten 8 Wochen aus Supabase
 */
async function getTrainingStats(supabase: any, userId: string): Promise<{ kw: number, count: number }[]> {
  const stats = [];
  const now = new Date();

  for (let i = 7; i >= 0; i--) {
    const startOfWeek = new Date(now);
    const dayDiff = (now.getDay() === 0 ? 6 : now.getDay() - 1);
    startOfWeek.setDate(now.getDate() - (i * 7) - dayDiff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const kw = getISOWeek(startOfWeek);

    const { count, error } = await (supabase
      .from('trainings_log') as any)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('completed_at', startOfWeek.toISOString())
      .lte('completed_at', endOfWeek.toISOString());

    stats.push({
      kw: kw,
      count: error ? 0 : (count || 0)
    });
  }
  return stats;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const userName = user.user_metadata.full_name || 'User';
  const today = new Date().toLocaleDateString('en-CA');

  // Daily Entry Laden
  const { data: entry } = await supabase
    .from('daily_entries')
    .select('score, note')
    .eq('user_id', user.id)
    .eq('date', today)
    .single();

  const stats = await getTrainingStats(supabase, user.id);

  // Koordinaten für die gelbe Linie
  const svgPoints = stats.map((item, i) => {
    const x = (i * 12.5) + 6.25;
    const y = 100 - (Math.min(item.count, 8) / 8 * 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
      
      {/* Header Bereich - Mit Cursive Font aus Mockup */}
      <div className="w-full max-w-md flex justify-between items-start mb-8 text-left">
        <div>
          <h2 className="font-[family-name:var(--font-cursive)] text-[#c5c1aa] text-5xl leading-tight lowercase opacity-90">
            hello {userName}
          </h2>
        </div>
        
        <Link href="/trainings" className="flex flex-col items-center group">
            <div className="w-12 h-12 border border-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-gray-50 transition-colors shadow-sm">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b57a84" strokeWidth="1.5">
                 <path d="M12 7a2 2 0 100-4 2 2 0 000 4zM5 12l2-1 3 2 2-2 3 2 2-2M7 21h10" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] mt-2 text-gray-400 font-bold">Training</span>
        </Link>
      </div>

      {/* Mood & Notes Formular */}
      <form action={saveDailyEntry} className="w-full max-w-md mb-10 text-left">
        <h3 className="font-bold text-gray-800 mb-6 text-lg">How are you feeling today?</h3>
        
        <div className="flex justify-between px-2 mb-12 group/moods">
          {[
            { emoji: '🤩', val: 4 },
            { emoji: '😊', val: 3 },
            { emoji: '😢', val: 2 },
            { emoji: '😴', val: 1 }
          ].map((item) => (
            <label key={item.val} className="cursor-pointer relative">
              <input 
                type="radio" 
                name="score" 
                value={item.val} 
                className="hidden peer" 
                defaultChecked={entry?.score === item.val} 
              />
              <span className="text-4xl transition-all duration-500 inline-block 
                hover:scale-110 
                peer-checked:scale-125 peer-checked:grayscale-0
                group-has-[:checked]/moods:grayscale group-has-[:checked]/moods:opacity-40
                peer-checked:group-has-[:checked]/moods:grayscale-0 peer-checked:group-has-[:checked]/moods:opacity-100">
                {item.emoji}
              </span>
            </label>
          ))}
        </div>

        <label className="block font-bold text-gray-800 mb-3 text-lg">Notes:</label>
        <textarea 
          name="note"
          defaultValue={entry?.note || ''}
          className="w-full h-32 bg-[#f2f2eb] rounded-[25px] p-5 outline-none resize-none border-none text-gray-700 shadow-inner placeholder-gray-400"
          placeholder="Schreibe hier deine Gedanken..."
        />
        
        <div className="flex justify-end items-center mt-6">
          <button 
            type="submit"
            className="bg-[#b57a84] text-white px-10 py-3 rounded-2xl font-bold shadow-lg hover:bg-[#a36972] active:scale-95 transition-all text-lg"
          >
            Save
          </button>
        </div>
      </form>

      {/* Insights Bereich */}
      <div className="w-full max-w-md mt-4">
        <h3 className="font-bold text-gray-800 text-center mb-12 text-lg">Insights</h3>
        
        <div className="relative h-44 w-full ml-6">
          
          {/* Y-Achse Beschriftung */}
          <div className="absolute -left-8 inset-y-0 w-6 flex flex-col justify-between text-[10px] text-gray-300 font-bold pointer-events-none z-30">
            {[8, 6, 4, 2, 0].map(val => <span key={val} className="leading-[0] h-0">{val}</span>)}
          </div>

          {/* Horizontale Gitterlinien */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
            {[8, 6, 4, 2, 0].map((line) => (
              <div key={line} className="w-full border-t border-gray-100 h-0" />
            ))}
          </div>

          {/* DYNAMISCHES LINIENDIAGRAMM (GELBE VERBINDUNG) */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 h-full w-full pointer-events-none z-20 overflow-visible" 
            preserveAspectRatio="none"
          >
            <polyline
              points={svgPoints}
              fill="none"
              stroke="#f1c40f"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* KREIS-PUNKTE */}
          <div className="absolute inset-0 h-full w-full pointer-events-none z-30 overflow-visible">
            {stats.map((item, i) => {
              const x = (i * 12.5) + 6.25;
              const y = 100 - (Math.min(item.count, 8) / 8 * 100);
              return (
                <div 
                  key={`dot-${i}`}
                  className="absolute w-2 h-2 bg-[#f1c40f] rounded-full border border-white shadow-sm"
                  style={{ 
                    left: `${x}%`, 
                    top: `${y}%`, 
                    transform: 'translate(-50%, -50%)' 
                  }}
                />
              );
            })}
          </div>

          {/* Balken & Hover Container */}
          <div className="relative h-full w-full flex items-end justify-around pb-0 z-10">
            {stats.map((item, i) => (
              <div key={i} className="group relative flex flex-col items-center w-[10%] h-full justify-end">
                
                {/* --- VERTIKALE GESTRICHELTE LINIE (FÜR DEN LOOK AUS IMAGE_ABF6A9) --- */}
                <div className="absolute inset-x-0 top-0 bottom-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="border-l border-dashed border-gray-300 h-full" />
                </div>

                {/* Tooltip bei Hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[#2d2d2d] text-white text-[12px] font-bold py-1.5 px-3 rounded-lg z-40 shadow-xl transform -translate-y-1 group-hover:translate-y-0">
                  {item.count}
                  <div className="absolute top-full left-1/2 -ml-1 border-[6px] border-transparent border-t-[#2d2d2d]"></div>
                </div>

                {/* Balken */}
                <div 
                  className={`w-full rounded-t-lg transition-all duration-500 relative z-10 ${
                    i === stats.length - 1 
                      ? 'bg-[#b57a84] group-hover:bg-[#a36972]' 
                      : 'bg-[#e5e5dd] group-hover:bg-[#d1d1c7]'
                  }`} 
                  style={{ height: `${(Math.min(item.count, 8) / 8) * 100}%` }}
                />
                
                {/* X-Achse Beschriftung (DYNAMISCHE KW) */}
                <span className="absolute -bottom-7 text-[9px] text-gray-400 font-bold tracking-tighter uppercase">
                  KW{item.kw}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto py-12 text-center">
         <Link href="/impressum" className="text-[10px] text-gray-300 underline uppercase tracking-[0.3em] font-bold">
            About us
         </Link>
      </div>
    </main>
  );
}