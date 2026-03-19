"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Session {
  id: string;
  mode: string;
  title: string;
  level: string;
  focus: string;
  createdAt: string;
  prompts: string;
  answers: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load sessions.");
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/app" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              ← Back to modes
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Your Sessions</h1>
            <p className="text-gray-600 mt-1">All your coaching sessions in one place.</p>
          </div>
          <Link
            href="/app"
            className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            + New Session
          </Link>
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-500">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4" />
            <p>Loading sessions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No sessions yet</h2>
            <p className="text-gray-500 mb-6">Start your first coaching session to see it here.</p>
            <Link
              href="/app"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Start first session →
            </Link>
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <div className="space-y-4">
            {sessions.map((session) => {
              const answers = JSON.parse(session.answers ?? "{}") as Record<string, string>;
              const answeredCount = Object.keys(answers).length;
              const totalCount = JSON.parse(session.prompts ?? "[]").length;
              const isInterview = session.mode === "interview";

              return (
                <Link
                  key={session.id}
                  href={`/app/sessions/${session.id}`}
                  className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{isInterview ? "🎤" : "💼"}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{session.title}</h3>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              isInterview
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {isInterview ? "Interview" : "Pitch"}
                          </span>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {session.level}
                          </span>
                        </div>
                        {session.focus && (
                          <p className="text-sm text-gray-500 mb-1">Focus: {session.focus}</p>
                        )}
                        <p className="text-xs text-gray-400">{formatDate(session.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-gray-700">
                        {answeredCount}/{totalCount}
                      </div>
                      <div className="text-xs text-gray-400">answered</div>
                    </div>
                  </div>

                  {answeredCount > 0 && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${(answeredCount / totalCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
