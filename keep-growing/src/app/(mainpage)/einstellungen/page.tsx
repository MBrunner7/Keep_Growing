import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function EinstellungenPage() {
  const supabase = await createClient();

  // AUTH-CHECK: Nur für eingeloggte User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  /**
   * Server Action für den Logout
   */
  async function handleLogout() {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
      
      {/* Header mit Zurück-Pfeil */}
      <div className="w-full max-w-md flex justify-between items-center mb-12">
        <Link href="/dashboard" className="p-2 -ml-2 group">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-gray-600 transition-colors">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </Link>
        <h1 className="text-gray-800 font-bold text-lg">Einstellungen</h1>
        <div className="w-8" /> {/* Spacer für Zentrierung */}
      </div>

      <div className="w-full max-w-md space-y-6">
        
        {/* Account Sektion */}
        <section className="bg-[#f2f2eb] rounded-[25px] p-6 shadow-sm">
          <h2 className="text-gray-400 uppercase text-[10px] tracking-[0.2em] font-bold mb-4">Account</h2>
          <div className="flex flex-col gap-1">
            <span className="text-gray-800 font-medium">{user.user_metadata.full_name || 'User'}</span>
            <span className="text-gray-400 text-sm">{user.email}</span>
          </div>
        </section>

        {/* Logout Button */}
        <form action={handleLogout}>
          <button 
            type="submit"
            className="w-full bg-[#b57a84] text-white py-4 rounded-[20px] font-bold shadow-lg hover:bg-[#a36972] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Abmelden
          </button>
        </form>

      </div>

      {/* Footer */}
      <div className="mt-auto py-12 text-center">
        <Link href="/impressum" className="text-[10px] text-gray-300 underline uppercase tracking-[0.3em] font-bold hover:text-gray-600 transition-colors">
          About us
        </Link>
      </div>
    </main>
  );
}