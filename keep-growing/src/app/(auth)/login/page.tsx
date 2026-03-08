import Link from 'next/link';
import Image from 'next/image';
import LoginForm from './login-form';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  const params = await searchParams;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-end font-[family-name:var(--font-geist-sans)]">
      
      {/* Illustrations-Bereich oben */}
      <div className="flex-1 flex items-center justify-center w-full p-10 relative">
        <div className="relative w-80 h-80 flex items-center justify-center">
          <div className="absolute w-72 h-72 bg-[#fdfcfb] rounded-full border border-[#f2f2eb]" />
          
          <div className="relative z-10 w-full h-full">
            <Image
              src="/images/Yoga_Frau.jpg"
              alt="Yoga Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Login Container (Beige) */}
      <div className="bg-[#f2f2eb] w-full max-w-md rounded-t-[50px] p-10 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative">
        
        {/* Schwebender Pfeil-Button */}
        <div className="absolute -top-7 right-12 bg-[#b57a84] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Schmetterling Emojis - Kompakt & verschiedene Richtungen */}
        <div className="absolute right-12 top-14 pointer-events-none select-none">
          <div className="relative w-12 h-16">
            {/* Oberster: klein & nach links geneigt */}
            <span className="absolute -top-1 right-4 text-[14px] -rotate-[35deg] opacity-90">🦋</span>
            
            {/* Mittlerer: mittel & nach rechts geneigt */}
            <span className="absolute top-4 right-6 text-[20px] rotate-[20deg] opacity-90">🦋</span>
            
            {/* Unterster: am größten & leicht nach links geneigt */}
            <span className="absolute top-10 right-1 text-[28px] -rotate-[10deg] opacity-100">🦋</span>
          </div>
        </div>

        {/* Header - Welcome Back! */}
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

        <div className="w-full">
          <LoginForm />
        </div>

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