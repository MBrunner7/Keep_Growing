"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SavedFlower = {
  id: string;
  user_id: string;
  flower_type: string;
  x: number;
  y: number;
  layer_order: number;
  created_at: string;
};

type PendingFlower = {
  x: number;
  y: number;
  flower_type: string;
};

type GardenMode = "view" | "place-new" | "edit-select" | "edit-move";

const flowerImages: Record<string, string> = {
  creativityWarmth: "/images/flower-1.png",
  imaginativeTraining: "/images/flower-2.png",
  innerPeace: "/images/flower-3.png",
  selfEmpowerment: "/images/flower-4.png",
};

export default function BlumengartenPage() {
  const router = useRouter();
  const supabase = createClient();
  const gardenRef = useRef<HTMLDivElement>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState("johanna");
  const [flowers, setFlowers] = useState<SavedFlower[]>([]);
  const [selectedFlowerType, setSelectedFlowerType] = useState<string | null>(
    null,
  );

  const [mode, setMode] = useState<GardenMode>("view");

  const [pendingNewFlower, setPendingNewFlower] =
    useState<PendingFlower | null>(null);

  const [editingFlowerId, setEditingFlowerId] = useState<string | null>(null);
  const [pendingEditPosition, setPendingEditPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadGarden() {
      setLoading(true);
      setErrorMessage(null);

      const selected = localStorage.getItem("selectedFlower");

      if (selected) {
        setSelectedFlowerType(selected);
        setMode("place-new");
      } else {
        setSelectedFlowerType(null);
        setMode("view");
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setUserName((user.user_metadata.full_name || "johanna").toLowerCase());

      const { data, error } = await supabase
        .from("flower_garden")
        .select("*")
        .eq("user_id", user.id)
        .order("layer_order", { ascending: true });

      if (error) {
        setErrorMessage(`Flower garden could not be loaded: ${error.message}`);
      } else {
        setFlowers(data ?? []);
      }

      setLoading(false);
    }

    loadGarden();
  }, [router, supabase]);

  function getRelativePosition(e: React.MouseEvent<HTMLDivElement>) {
    if (!gardenRef.current) return null;

    const rect = gardenRef.current.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / rect.width;
    const rawY = (e.clientY - rect.top) / rect.height;

    return {
      x: Math.max(0.08, Math.min(0.92, rawX)),
      y: Math.max(0.14, Math.min(0.92, rawY)),
    };
  }

  function handleGardenClick(e: React.MouseEvent<HTMLDivElement>) {
    if (saving) return;

    const pos = getRelativePosition(e);
    if (!pos) return;

    if (mode === "place-new" && selectedFlowerType) {
      setPendingNewFlower({
        x: pos.x,
        y: pos.y,
        flower_type: selectedFlowerType,
      });
      return;
    }

    if (mode === "edit-move" && editingFlowerId) {
      setPendingEditPosition({
        x: pos.x,
        y: pos.y,
      });
    }
  }

  function handleFlowerClickForEdit(flowerId: string) {
    if (mode !== "edit-select") return;

    setEditingFlowerId(flowerId);
    setPendingEditPosition(null);
    setMode("edit-move");
  }

  async function handleConfirmNewFlower() {
    if (!pendingNewFlower || !userId) return;

    setSaving(true);
    setErrorMessage(null);

    const nextLayerOrder =
      flowers.length > 0
        ? Math.max(...flowers.map((flower) => flower.layer_order)) + 1
        : 1;

    const { data, error } = await supabase
      .from("flower_garden")
      .insert({
        user_id: userId,
        flower_type: pendingNewFlower.flower_type,
        x: pendingNewFlower.x,
        y: pendingNewFlower.y,
        layer_order: nextLayerOrder,
      })
      .select()
      .single();

    if (error) {
      setErrorMessage(`The flower could not be saved: ${error.message}`);
      setSaving(false);
      return;
    }

    setFlowers((prev) => [...prev, data]);
    setPendingNewFlower(null);
    setSelectedFlowerType(null);
    localStorage.removeItem("selectedFlower");
    setMode("view");
    setSaving(false);
  }

  async function handleConfirmEdit() {
    if (!editingFlowerId || !pendingEditPosition) return;

    setSaving(true);
    setErrorMessage(null);

    const { error } = await supabase
      .from("flower_garden")
      .update({
        x: pendingEditPosition.x,
        y: pendingEditPosition.y,
      })
      .eq("id", editingFlowerId);

    if (error) {
      setErrorMessage(
        `The flower position could not be updated: ${error.message}`,
      );
      setSaving(false);
      return;
    }

    setFlowers((prev) =>
      prev.map((flower) =>
        flower.id === editingFlowerId
          ? { ...flower, x: pendingEditPosition.x, y: pendingEditPosition.y }
          : flower,
      ),
    );

    setEditingFlowerId(null);
    setPendingEditPosition(null);
    setMode("view");
    setSaving(false);
  }

  function handleStartEditMode() {
    setEditingFlowerId(null);
    setPendingEditPosition(null);
    setPendingNewFlower(null);
    setMode("edit-select");
  }

  function handleCancelEditMode() {
    setEditingFlowerId(null);
    setPendingEditPosition(null);
    setMode("view");
  }

  function handleLeaveGarden() {
    router.push("/dashboard");
  }

  const infoText =
    mode === "place-new"
      ? pendingNewFlower
        ? "Does this place feel right for your flower?"
        : "Choose a place where your new flower can grow."
      : mode === "edit-select"
        ? "Select a flower you would like to move."
        : mode === "edit-move"
          ? pendingEditPosition
            ? "Does this new place feel right for your flower?"
            : "Choose a new place for your flower."
          : "You’ve been at it for four days already! Watch your flower meadow & your mind slowly grow.";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f3f1] flex items-center justify-center">
        <p className="text-[#7a6d71]">Loading flower garden...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3f1] flex flex-col items-center px-6 py-6">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-cursive)] text-[42px] leading-tight lowercase text-[#d1c7b0] opacity-90">
              hello {userName}
            </h2>
          </div>

          <div className="flex gap-2">
            {mode === "view" && (
              <button
                type="button"
                onClick={handleStartEditMode}
                className="rounded-[18px] bg-[#efe8e3] px-4 py-2.5 text-[14px] font-medium text-[#6b5c61] transition hover:bg-[#e8dfd9]"
              >
                Edit
              </button>
            )}

            {(mode === "edit-select" || mode === "edit-move") && (
              <button
                type="button"
                onClick={handleCancelEditMode}
                className="rounded-[18px] bg-[#efe8e3] px-4 py-2.5 text-[14px] font-medium text-[#6b5c61] transition hover:bg-[#e8dfd9]"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleLeaveGarden}
              className="flex h-11 w-11 items-center justify-center rounded-2xl transition hover:bg-[#f3ece8]"
              aria-label="Leave flower garden"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c08a95"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5 10v10h14V10" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-[22px] bg-[#ebe5df] px-5 py-4 text-center">
          <p className="text-[14px] leading-6 text-[#5e5357]">{infoText}</p>
        </div>

        <div
          ref={gardenRef}
          onClick={handleGardenClick}
          className="relative h-[360px] w-full overflow-hidden rounded-[28px] bg-[#f6f3f1]"
        >
          {flowers.map((flower) => {
            const imageSrc =
              flowerImages[flower.flower_type] ?? "/images/flower-1.png";
            const isEditingSelected = editingFlowerId === flower.id;

            const previewX =
              isEditingSelected && pendingEditPosition
                ? pendingEditPosition.x
                : flower.x;
            const previewY =
              isEditingSelected && pendingEditPosition
                ? pendingEditPosition.y
                : flower.y;

            return (
              <button
                key={flower.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlowerClickForEdit(flower.id);
                }}
                className="absolute"
                style={{
                  left: `${previewX * 100}%`,
                  top: `${previewY * 100}%`,
                  transform: "translate(-50%, -100%)",
                  zIndex: flower.layer_order,
                }}
              >
                <img
                  src={imageSrc}
                  alt={flower.flower_type}
                  className={`w-[110px] object-contain transition ${
                    isEditingSelected ? "scale-105 opacity-80" : ""
                  }`}
                />
              </button>
            );
          })}

          {pendingNewFlower && mode === "place-new" && (
            <img
              src={
                flowerImages[pendingNewFlower.flower_type] ??
                "/images/flower-1.png"
              }
              alt="New flower preview"
              className="pointer-events-none absolute w-[110px] object-contain opacity-80"
              style={{
                left: `${pendingNewFlower.x * 100}%`,
                top: `${pendingNewFlower.y * 100}%`,
                transform: "translate(-50%, -100%)",
                zIndex: 9999,
              }}
            />
          )}

          {flowers.length === 0 && mode === "view" && (
            <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
              <p className="text-sm text-[#b2a8ab]">
                No flowers placed yet. Choose a new flower from training first.
              </p>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mt-5 rounded-[22px] bg-[#f8e8ea] px-5 py-4 text-center">
            <p className="text-[14px] leading-6 text-[#9b5d68]">
              {errorMessage}
            </p>
          </div>
        )}

        {mode === "place-new" && pendingNewFlower && (
          <div className="mt-5">
            <button
              type="button"
              onClick={handleConfirmNewFlower}
              disabled={saving}
              className="w-full rounded-[18px] bg-[#c08a95] px-4 py-3 text-[15px] font-medium text-white shadow-sm transition hover:bg-[#b67f8a] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Confirm position"}
            </button>
          </div>
        )}

        {mode === "edit-move" && editingFlowerId && pendingEditPosition && (
          <div className="mt-5">
            <button
              type="button"
              onClick={handleConfirmEdit}
              disabled={saving}
              className="w-full rounded-[18px] bg-[#c08a95] px-4 py-3 text-[15px] font-medium text-white shadow-sm transition hover:bg-[#b67f8a] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Confirm new position"}
            </button>
          </div>
        )}

        {mode === "view" && (
          <div className="mt-6 rounded-[22px] bg-[#ebe5df] px-5 py-4 text-center">
            <p className="text-[15px] leading-6 text-[#5e5357]">
              Make a difference! Support biodiversity
              <br />
              with a wildflower meadow sponsorship
              <br />
              for 2,99 $. More info.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.push("/impressum")}
            className="text-[11px] text-[#4f6175] underline underline-offset-2"
          >
            About us
          </button>
        </div>
      </div>
    </main>
  );
}