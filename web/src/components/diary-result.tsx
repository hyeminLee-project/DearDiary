"use client";

import { useRef, useState, useCallback } from "react";

interface DiaryResultProps {
  english: string;
  korean: string;
  onBack: () => void;
}

export default function DiaryResult({ english, korean, onBack }: DiaryResultProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<"en" | "ko">("ko");
  const [saving, setSaving] = useState(false);

  const diary = lang === "ko" ? korean : english;

  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `dear-diary-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setSaving(false);
    }
  }, [saving]);

  const handleShareTwitter = useCallback(() => {
    const lines = diary.split("\n").filter((l) => l.trim());
    const preview = lines.slice(0, 3).join("\n");
    const text = `${preview}\n\n✍️ Written with Dear Diary`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [diary]);

  return (
    <main className="flex-1 flex flex-col items-center px-5 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-warm-500 hover:text-warm-700 text-sm flex items-center gap-1 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            새 일기
          </button>

          {/* Language Toggle */}
          <div className="flex rounded-lg bg-warm-100 p-0.5">
            <button
              onClick={() => setLang("ko")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                lang === "ko" ? "bg-white text-warm-800 shadow-sm" : "text-warm-500"
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                lang === "en" ? "bg-white text-warm-800 shadow-sm" : "text-warm-500"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Diary Card */}
        <div
          ref={cardRef}
          className="rounded-2xl bg-gradient-to-br from-warm-100 via-white to-warm-50 p-6 shadow-sm border border-warm-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📝</span>
            <span className="text-xs font-medium text-warm-400 tracking-wide uppercase">
              {new Date().toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="prose prose-sm max-w-none">
            {diary.split("\n").map((line, i) => {
              if (!line.trim()) return <div key={i} className="h-3" />;
              if (line.startsWith("💡")) {
                return (
                  <p key={i} className="text-warm-600 italic text-sm mt-4 pt-4 border-t border-warm-200">
                    {line}
                  </p>
                );
              }
              if (line.startsWith("#")) {
                return (
                  <h3 key={i} className="text-warm-700 font-semibold text-base mt-3 mb-1">
                    {line.replace(/^#+\s*/, "")}
                  </h3>
                );
              }
              return (
                <p key={i} className="text-warm-700 text-sm leading-relaxed">
                  {line}
                </p>
              );
            })}
          </div>

          <p className="text-right text-[10px] text-warm-300 mt-6">Dear Diary</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSaveImage}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-warm-700 py-3 text-sm
              font-semibold text-white hover:bg-warm-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {saving ? "저장 중..." : "이미지 저장"}
          </button>

          <button
            onClick={handleShareTwitter}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-warm-800 py-3 text-sm
              font-semibold text-white hover:bg-warm-900 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            트위터 공유
          </button>
        </div>

        <p className="text-center text-[11px] text-warm-400 mt-4">
          이미지를 저장해서 인스타그램 스토리에 올려보세요 ✨
        </p>
      </div>
    </main>
  );
}
