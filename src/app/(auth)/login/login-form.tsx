'use client';

import { useState } from 'react';
import { handleLogin } from '@/app/actions';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={handleLogin} className="space-y-8 text-left">
      <div className="relative">
        <input 
          name="email"
          type="email" 
          required
          placeholder="Email"
          className="w-full bg-transparent border-b border-gray-400 py-3 outline-none focus:border-[#b57a84] transition-colors placeholder-gray-400 text-gray-600"
        />
      </div>

      <div className="relative">
        <input 
          name="password"
          type={showPassword ? "text" : "password"}
          required
          placeholder="Password"
          className="w-full bg-transparent border-b border-gray-400 py-3 outline-none focus:border-[#b57a84] transition-colors placeholder-gray-400 text-gray-600"
        />
        
        {/* Auge-Icon Button */}
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-0 top-4 transition-colors duration-200 ${
            showPassword ? "text-gray-800" : "text-gray-400"
          }`}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
            {!showPassword && <line x1="3" y1="21" x2="21" y2="3" stroke="currentColor" strokeWidth="2" />}
          </svg>
        </button>
      </div>

      <button 
        type="submit"
        className="w-full bg-[#b57a84] text-white py-4 rounded-3xl text-xl font-bold hover:bg-[#a36972] active:scale-[0.98] transition-all shadow-md mt-6"
      >
        Login
      </button>
    </form>
  );
}