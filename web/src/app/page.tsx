"use client";

import { useState } from "react";
import DiaryResult from "@/components/diary-result";

export default function Home() {
  const [keywords, setKeywords] = useState("");
  const [highlight, setHighlight] = useState("");
  const [diary, setDiary] = useState<{ english: string; korean: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!keywords.trim() || !highlight.trim()) return;

    setLoading(true);
    setError("");
    setDiary(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, highlight }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDiary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (diary) {
    return (
      <DiaryResult
        english={diary.english}
        korean={diary.korean}
        onBack={() => setDiary(null)}
      />
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-warm-800">
            Dear Diary
          </h1>
          <p className="mt-2 text-warm-500 text-sm">
            오늘 하루를 AI가 감성 일기로 만들어드려요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-warm-700 mb-1.5">
              오늘의 키워드
            </label>
            <input
              id="keywords"
              type="text"
              placeholder="예: nephew, birthday, Bing Su"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm
                placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-400
                transition-shadow"
            />
          </div>

          <div>
            <label htmlFor="highlight" className="block text-sm font-medium text-warm-700 mb-1.5">
              오늘의 하이라이트
            </label>
            <input
              id="highlight"
              type="text"
              placeholder="예: Had dinner with nephew for their birthday"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              className="w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm
                placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-warm-400
                transition-shadow"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !keywords.trim() || !highlight.trim()}
            className="w-full rounded-xl bg-warm-700 py-3.5 text-sm font-semibold text-white
              hover:bg-warm-800 disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                일기 생성 중...
              </span>
            ) : (
              "일기 생성하기"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
