"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const levels = ["Entry", "Junior", "Mid", "Senior"];

function NewSessionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") ?? "interview") as "interview" | "pitch";

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Junior");
  const [focus, setFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isInterview = mode === "interview";
  const modeLabel = isInterview ? "Interview Coach" : "Pitch / Portfolio Coach";
  const titleLabel = isInterview ? "Role / Job Title" : "Project or Goal";
  const titlePlaceholder = isInterview
    ? "e.g. Frontend Developer, Data Analyst, Product Manager"
    : "e.g. My portfolio website, Job search pitch, GitHub projects";
  const focusLabel = isInterview ? "Focus Areas" : "Topics to Cover";
  const focusPlaceholder = isInterview
    ? "e.g. React, system design, leadership, communication"
    : "e.g. project impact, technical decisions, what I learned";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError(`${titleLabel} is required.`);
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, title: title.trim(), level, focus: focus.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create session");
      }

      const session = await res.json();
      router.push(`/app/sessions/${session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/app" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            ← Back to mode picker
          </Link>
          <div className="mt-4">
            <span
              className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mb-3 ${
                isInterview
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {isInterview ? "🎤" : "💼"} {modeLabel}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">Start a New Session</h1>
            <p className="text-gray-600 mt-2">
              Fill in a few details and we&apos;ll generate personalized coaching questions for you.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
          {/* Title / Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {titleLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={titlePlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Experience Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {levels.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    level === l
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {focusLabel}{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder={focusPlaceholder}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900 placeholder-gray-400 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating questions...
              </>
            ) : (
              "Generate Questions →"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function NewSessionPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
      </main>
    }>
      <NewSessionForm />
    </Suspense>
  );
}
