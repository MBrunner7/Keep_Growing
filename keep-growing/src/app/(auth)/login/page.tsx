import Link from 'next/link';
import LoginForm from './login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-end font-[family-name:var(--font-geist-sans)]">
      
      {/* Illustrations-Bereich oben */}
      <div className="flex-1 flex items-center justify-center w-full p-10">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="w-full h-full bg-[#fdfcfb] rounded-full border border-[#f2f2eb] flex items-center justify-center">
            <span className="text-6xl">🧘‍♀️</span>
          </div>
        </div>
      </div>

      {/* Login Container (Beige aus Mockup) */}
      <div className="bg-[#f2f2eb] w-full max-w-md rounded-t-[50px] p-10 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative">
        
        {/* Schwebender Pfeil-Button */}
        <div className="absolute -top-7 right-12 bg-[#b57a84] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Header - Exakt wie im Bild-Ausschnitt */}
        <div className="mb-10 text-left">
          <h1 className="text-[24px] font-bold text-[#555555] leading-tight mb-1">
            Welcome Back!
          </h1>
          <p className="text-[#b57a84] text-[22px] font-semibold opacity-90">
            Login to your Account
          </p>
        </div>

        {/* Feedback Messages */}
        {params.message === 'check-email' && (
          <div className="mb-6 p-4 bg-white/50 border border-blue-100 text-blue-700 text-sm rounded-2xl text-center backdrop-blur-sm">
            Fast geschafft! Bitte bestätige deine E-Mail-Adresse.
          </div>
        )}

        {params.error && (
          <div className="mb-6 p-4 bg-white/50 border border-red-100 text-red-600 text-sm rounded-2xl text-center backdrop-blur-sm">
            E-Mail oder Passwort ist falsch.
          </div>
        )}

        {/* LoginForm */}
        <LoginForm />

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-6 font-semibold">
            Do not have an account? {' '}
            <Link href="/register" className="text-[#b57a84] font-bold hover:underline">
              Sign up
            </Link>
          </p>
          
          <Link 
            href="/impressum" 
            className="text-[10px] text-gray-400 underline uppercase tracking-[0.3em] font-bold hover:text-gray-600 transition-colors"
          >
            About us
          </Link>
        </div>
      </div>
    </main>
  );
}