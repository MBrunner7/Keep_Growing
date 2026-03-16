"use client";

import { useRouter } from "next/navigation";

export default function TrainingsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl mb-6 text-gray-800 font-bold">
        Start your training
      </h1>

      <p className="text-gray-500 mb-10 text-center max-w-sm">
        Complete today's autogenic training and grow your flower meadow.
      </p>

      <button
        onClick={() => router.push("/blumengarten/auswahl_blume")}
        className="bg-[#b57a84] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#a36972] active:scale-95 transition-all"
      >
        Choose your training
      </button>
    </main>
  );
}
