import Link from "next/link";

const modes = [
  {
    id: "interview",
    emoji: "🎤",
    title: "Interview Coach",
    description:
      "Prepare for behavioral and technical interviews. Practice structured answers using the STAR method and get scored feedback.",
    color: "indigo",
    features: ["Behavioral questions", "Technical questions", "STAR method feedback", "Score & suggestions"],
  },
  {
    id: "pitch",
    emoji: "💼",
    title: "Pitch / Portfolio Coach",
    description:
      "Perfect your portfolio presentation and personal pitch. Learn to talk about your projects with confidence and clarity.",
    color: "purple",
    features: ["Portfolio walkthroughs", "Elevator pitch practice", "Storytelling feedback", "Impact & clarity score"],
  },
];

export default function AppPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-4 inline-block">
            ← Back to home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-emerald-500 bg-clip-text text-transparent forced-colors:text-indigo-600 mb-4">
            Choose Your Coaching Mode
          </h1>
          <p className="text-lg text-gray-600">
            Select the type of coaching session you want to start.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {modes.map((mode) => (
            <Link
              key={mode.id}
              href={`/app/new?mode=${mode.id}`}
              className={`block bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-md border-2 transition-all duration-200 hover:shadow-xl hover:-translate-y-1.5 active:translate-y-0 ${
                mode.color === "indigo"
                  ? "border-indigo-100 hover:border-indigo-300 hover:shadow-indigo-200/50"
                  : "border-purple-100 hover:border-purple-300 hover:shadow-purple-200/50"
              }`}
            >
              <div className="text-5xl mb-5">{mode.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{mode.title}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{mode.description}</p>
              <ul className="space-y-2">
                {mode.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        mode.color === "indigo" ? "bg-indigo-500" : "bg-purple-500"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <div
                className={`mt-6 inline-flex items-center font-semibold text-sm ${
                  mode.color === "indigo" ? "text-indigo-600" : "text-purple-600"
                }`}
              >
                Start session →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
