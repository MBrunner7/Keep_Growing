import Link from 'next/link';

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start font-[family-name:var(--font-geist-sans)]">
      
      {/* Header Bereich mit Home-Icon (Mockup Page 16) */}
      <div className="w-full max-w-md p-8 pt-12 flex justify-end">
        <Link href="/dashboard" className="text-[#b57a84] hover:scale-110 transition-transform">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      <div className="w-full max-w-md px-10">
        {/* Titel mit Cursive Font */}
        <div className="mb-12 text-center">
          <h1 className="font-[family-name:var(--font-cursive)] text-[#b57a84] text-5xl opacity-90">
            About us
          </h1>
          <div className="h-1 w-12 bg-[#f2f2eb] mx-auto mt-4 rounded-full" />
        </div>

        {/* Content-Bereich (Mockup Page 16 Links) */}
        <div className="space-y-12">
          
          <section>
            <h2 className="text-[#c5c1aa] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Impressum</h2>
            <div className="text-gray-500 text-sm leading-relaxed space-y-1">
              <p className="font-bold text-gray-700">Keep Growing GmbH</p>
              <p>Blütenweg 12</p>
              <p>12345 Gartenstadt</p>
              <p className="pt-2">Vertreten durch: Johanna Blume</p>
              <p>E-Mail: hello@keep-growing.de</p>
            </div>
          </section>

          <section>
            <h2 className="text-[#c5c1aa] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">AGB's</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Unsere allgemeinen Geschäftsbedingungen regeln die Nutzung der App und die Teilnahme an unseren Wildblumen-Patenschaften. Wir legen Wert auf Transparenz und ein achtsames Miteinander.
            </p>
            <button className="text-[#b57a84] text-xs font-bold mt-2 hover:underline">Vollständige AGB lesen</button>
          </section>

          <section>
            <h2 className="text-[#c5c1aa] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Datenschutz</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Deine mentalen Fortschritte sind privat. Wir verschlüsseln alle Notizen und geben keine Daten an Dritte weiter. Die Analyse deiner "Insights" erfolgt lokal auf deinem Profil.
            </p>
            <button className="text-[#b57a84] text-xs font-bold mt-2 hover:underline">Datenschutzerklärung</button>
          </section>

        </div>
      </div>

      {/* Footer Bereich */}
      <div className="mt-auto pb-12">
         <p className="text-[10px] text-gray-300 uppercase tracking-[0.2em]">
           Flower your mind
         </p>
      </div>
    </main>
  );
}  