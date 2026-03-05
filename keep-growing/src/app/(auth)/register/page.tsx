import Link from 'next/link';
import RegisterForm from './register-form';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start font-[family-name:var(--font-geist-sans)]">
      
      {/* Back-Pfeil oben links (Mockup Page 2) */}
      <div className="w-full max-w-md p-8 pt-12 flex justify-start">
        <Link href="/login" className="bg-[#b57a84] w-12 h-10 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      <div className="w-full max-w-md px-10 pb-10">
        <div className="mb-10 text-left">
          <h1 className="font-[family-name:var(--font-cursive)] text-[#b57a84] text-5xl opacity-90 leading-tight">
            Create an Account
          </h1>
        </div>

        {/* Fehleranzeige */}
        {params.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl text-center">
            Es gab ein Problem bei der Registrierung.
          </div>
        )}

        {/* RegisterForm - Enthält Name, Email, Password, Confirm Password */}
        <RegisterForm />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-8 font-semibold">
            Already have an account? {' '}
            <Link href="/login" className="text-[#b57a84] font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Blumen-Illustration am unteren Rand (Mockup Page 2) */}
      <div className="mt-auto w-full flex justify-center items-end p-0 overflow-hidden">
        <div className="relative w-full h-32 flex justify-center items-end opacity-60">
          <span className="text-6xl mb-[-10px] tracking-widest">🌸🪻🌼🌷🌸</span>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pb-8">
        <Link 
          href="/impressum" 
          className="text-[10px] text-gray-400 underline uppercase tracking-[0.3em] font-bold hover:text-gray-600 transition-colors"
        >
          About us
        </Link>
      </div>
    </main>
  );
}