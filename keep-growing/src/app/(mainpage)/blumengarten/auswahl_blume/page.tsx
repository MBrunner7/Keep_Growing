"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FlowerType =
  | "creativityWarmth"
  | "imaginativeTraining"
  | "innerPeace"
  | "selfEmpowerment";

type FlowerOption = {
  id: FlowerType;
  title: string;
  description: string;
  image: string;
};

const flowerOptions: FlowerOption[] = [
  {
    id: "creativityWarmth",
    title: "Creativity & warmth",
    description: "A soft flower for calm and positive energy.",
    image: "/images/flower-1.png",
  },
  {
    id: "imaginativeTraining",
    title: "Imaginative training",
    description: "A bright flower for focus and imagination.",
    image: "/images/flower-2.png",
  },
  {
    id: "innerPeace",
    title: "Inner peace",
    description: "A gentle flower for quiet and balance.",
    image: "/images/flower-3.png",
  },
  {
    id: "selfEmpowerment",
    title: "Self-empowerment",
    description: "A strong flower for confidence and growth.",
    image: "/images/flower-4.png",
  },
];

export default function FlowerSelectionPage() {
  const router = useRouter();
  const [selectedFlower, setSelectedFlower] = useState<FlowerType | null>(null);

  function handleContinue() {
    if (!selectedFlower) return;

    localStorage.setItem("selectedFlower", selectedFlower);
    router.push("/blumengarten");
  }

  return (
    <main className="min-h-screen bg-[#faf7f5] flex flex-col items-center px-6 py-8">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 text-sm text-[#b57a84] font-semibold hover:underline"
        >
          ← Back
        </button>

        <div className="mb-8 rounded-3xl bg-[#f2ebe8] px-6 py-5 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Choose your flower
          </h1>
          <p className="text-sm text-gray-600 leading-6">
            Select one flower as your reward and place it in your flower garden.
          </p>
        </div>

        <div className="space-y-4">
          {flowerOptions.map((flower) => {
            const isSelected = selectedFlower === flower.id;

            return (
              <button
                key={flower.id}
                type="button"
                onClick={() => setSelectedFlower(flower.id)}
                className={`w-full rounded-3xl border p-4 text-left transition-all shadow-sm ${
                  isSelected
                    ? "border-[#b57a84] bg-[#f6e8ec] ring-2 ring-[#d9aeb8]"
                    : "border-[#ece7e3] bg-white hover:bg-[#fcf8f9]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center">
                    <img
                      src={flower.image}
                      alt={flower.title}
                      className="h-24 object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-semibold text-gray-800">
                          {flower.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 leading-5">
                          {flower.description}
                        </p>
                      </div>

                      <div
                        className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs ${
                          isSelected
                            ? "border-[#b57a84] bg-[#b57a84] text-white"
                            : "border-gray-300 bg-white text-transparent"
                        }`}
                      >
                        ✓
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedFlower}
          className="mt-8 w-full rounded-2xl bg-[#b57a84] px-6 py-4 text-white font-bold shadow-md transition-all hover:bg-[#a36972] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#d8c7cb]"
        >
          Place flower in garden
        </button>
      </div>
    </main>
  );
}