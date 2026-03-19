import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="mb-6">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full">
            🎯 Your Personal AI Coach
          </span>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Vibe Coach
        </h1>

        <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
          Level up your interview game and portfolio pitch with AI-powered coaching.
          Practice, get feedback, and grow your confidence — all in one place.
        </p>

        <p className="text-base text-gray-500 mb-12 max-w-xl mx-auto">
          Whether you&apos;re preparing for your next interview or refining your portfolio story,
          Vibe Coach helps you practice with real questions and get instant feedback.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/app"
            className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Start Coaching →
          </Link>
          <Link
            href="/app/sessions"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            View Sessions
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">
          Two coaching modes. One goal: get hired.
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Interview Coach</h3>
            <p className="text-gray-600 leading-relaxed">
              Practice behavioral and technical interview questions tailored to your role and level.
              Get scored answers and suggestions to improve your responses using the STAR method.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Pitch / Portfolio Coach</h3>
            <p className="text-gray-600 leading-relaxed">
              Sharpen how you present your projects and personal brand. Practice portfolio walkthroughs,
              elevator pitches, and storytelling about your technical work.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-indigo-50 rounded-2xl p-8 text-center border border-indigo-100">
          <p className="text-indigo-800 font-medium text-lg">
            🚀 AI-ready — built with a clean interface to plug in real AI later.
            Currently powered by expertly crafted mock content so you can start practicing right away.
          </p>
        </div>
      </div>
    </main>
  );
}
