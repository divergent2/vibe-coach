"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Session {
  id: string;
  mode: string;
  title: string;
  level: string;
  focus: string;
  prompts: string;
  answers: string;
  feedback: string;
  createdAt: string;
}

interface FeedbackResult {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-green-100 text-green-700" :
    score >= 60 ? "bg-yellow-100 text-yellow-700" :
    "bg-red-100 text-red-700";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-sm ${color}`}>
      {score}/100
    </span>
  );
}

export default function SessionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, FeedbackResult>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showSuggested, setShowSuggested] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`/api/sessions/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Session not found");
        return r.json();
      })
      .then((data: Session) => {
        setSession(data);
        setAnswers(JSON.parse(data.answers ?? "{}"));
        setFeedback(JSON.parse(data.feedback ?? "{}"));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  async function handleGetFeedback(index: number) {
    const answer = answers[String(index)] ?? "";
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/sessions/${id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptIndex: index, answer }),
      });
      const data: FeedbackResult = await res.json();
      setFeedback((prev) => ({ ...prev, [String(index)]: data }));
    } catch {
      // ignore feedback error silently
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4" />
          <p className="text-gray-500">Loading session...</p>
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h1>
          <p className="text-gray-500 mb-6">{error || "This session doesn't exist."}</p>
          <Link href="/app/sessions" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Back to sessions
          </Link>
        </div>
      </main>
    );
  }

  const prompts: string[] = JSON.parse(session.prompts);
  const isInterview = session.mode === "interview";
  const answeredCount = Object.keys(answers).filter((k) => answers[k]?.trim()).length;
  const currentAnswer = answers[String(activeIndex)] ?? "";
  const currentFeedback = feedback[String(activeIndex)];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/app/sessions" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            ← Back to sessions
          </Link>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl">{isInterview ? "🎤" : "💼"}</span>
                <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    isInterview ? "bg-indigo-100 text-indigo-700" : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {isInterview ? "Interview" : "Pitch"} · {session.level}
                </span>
              </div>
              {session.focus && (
                <p className="text-sm text-gray-500 mt-1 ml-9">Focus: {session.focus}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-700">
                {answeredCount} of {prompts.length} answered
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${(answeredCount / prompts.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Question Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                Questions ({prompts.length})
              </h2>
              <div className="space-y-1">
                {prompts.map((_, i) => {
                  const isAnswered = !!answers[String(i)]?.trim();
                  const hasFeedback = !!feedback[String(i)];
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 ${
                        activeIndex === i
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold ${
                          hasFeedback
                            ? "bg-green-100 text-green-700"
                            : isAnswered
                            ? "bg-yellow-100 text-yellow-700"
                            : activeIndex === i
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {hasFeedback ? "✓" : i + 1}
                      </span>
                      <span className="truncate">Q{i + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4">
            {/* Question */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {activeIndex + 1}
                </span>
                <p className="text-gray-900 font-medium leading-relaxed">{prompts[activeIndex]}</p>
              </div>
            </div>

            {/* Answer Textarea */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Answer
              </label>
              <textarea
                value={currentAnswer}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [String(activeIndex)]: e.target.value }))
                }
                placeholder={
                  isInterview
                    ? "Type your answer here. Try to use the STAR method: Situation, Task, Action, Result..."
                    : "Describe your project, your role, the decisions you made, and the impact it had..."
                }
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-900 placeholder-gray-400 resize-none"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <button
                  onClick={() => handleGetFeedback(activeIndex)}
                  disabled={!currentAnswer.trim() || submitting}
                  className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    "Get Feedback →"
                  )}
                </button>
              </div>
            </div>

            {/* Feedback */}
            {currentFeedback && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">Feedback</h3>
                  <ScoreBadge score={currentFeedback.score} />
                </div>

                {currentFeedback.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                      ✅ Strengths
                    </h4>
                    <ul className="space-y-1.5">
                      {currentFeedback.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentFeedback.improvements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-1">
                      💡 Improvements
                    </h4>
                    <ul className="space-y-1.5">
                      {currentFeedback.improvements.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <button
                    onClick={() =>
                      setShowSuggested((prev) => ({
                        ...prev,
                        [String(activeIndex)]: !prev[String(activeIndex)],
                      }))
                    }
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    {showSuggested[String(activeIndex)] ? "▼" : "▶"} Suggested Answer
                  </button>
                  {showSuggested[String(activeIndex)] && (
                    <div className="mt-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {currentFeedback.suggestedAnswer}
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                {activeIndex < prompts.length - 1 && (
                  <button
                    onClick={() => setActiveIndex(activeIndex + 1)}
                    className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors text-sm"
                  >
                    Next Question →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
