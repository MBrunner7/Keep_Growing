'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleSignUp } from '@/app/actions';

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const result = await handleSignUp(formData);

    if (result?.success) {
      // Zeigt das Bestätigungs-Fenster an statt sofortigem Redirect
      setShowSuccessModal(true);
    } else {
      setIsLoading(false);
      // Fehler-Parameter wird an die URL gehängt, falls vorhanden
      if (result?.error) {
        router.push(`/register?error=${result.error}`);
      }
    }
  }

  return (
    <>
      <form action={handleSubmit} className="space-y-6">
        <input name="name" type="text" placeholder="Name" required 
          className="w-full bg-transparent border-b border-gray-400 py-2 outline-none focus:border-[#b57a84] transition-colors placeholder-gray-400 text-gray-600" />
        
        <input name="email" type="email" placeholder="Email" required 
          className="w-full bg-transparent border-b border-gray-400 py-2 outline-none focus:border-[#b57a84] transition-colors placeholder-gray-400 text-gray-600" />
        
        <input name="password" type="password" placeholder="Password" required 
          className="w-full bg-transparent border-b border-gray-400 py-2 outline-none focus:border-[#b57a84] transition-colors placeholder-gray-400 text-gray-600" />
        
        <input name="confirmPassword" type="password" placeholder="Confirm Password" required 
          className="w-full bg-transparent border-b border-gray-400 py-2 outline-none focus:border-[#b57a84] transition-colors placeholder-gray-400 text-gray-600" />

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#b57a84] text-white py-4 rounded-3xl text-xl font-bold hover:bg-[#a36972] active:scale-[0.98] transition-all shadow-md mt-4 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Sign up'}
        </button>
      </form>

      {/* Das Bestätigungs-Fenster (Modal) */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-[35px] p-8 max-w-sm w-full text-center shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Check your Email!</h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Wir haben dir einen Bestätigungslink geschickt. Bitte aktiviere dein Konto, um fortzufahren.
            </p>
            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-[#b57a84] text-white py-3 rounded-2xl font-bold hover:bg-[#a36972] transition-colors shadow-lg"
            >
              Okay, zum Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}