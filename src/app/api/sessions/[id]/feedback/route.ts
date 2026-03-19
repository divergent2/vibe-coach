import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateFeedback } from "@/lib/generation/mock";

// POST /api/sessions/[id]/feedback - generate feedback for one answer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { promptIndex, answer } = body;

    if (answer === undefined || promptIndex === undefined) {
      return NextResponse.json(
        { error: "promptIndex and answer are required" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { id },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const prompts: string[] = JSON.parse(session.prompts);
    const prompt = prompts[promptIndex] ?? "";

    const result = generateFeedback(prompt, answer, session.mode);

    // Persist the answer and feedback
    const answers: Record<string, string> = JSON.parse(session.answers);
    const feedback: Record<string, object> = JSON.parse(session.feedback);
    answers[String(promptIndex)] = answer;
    feedback[String(promptIndex)] = result;

    await prisma.session.update({
      where: { id },
      data: {
        answers: JSON.stringify(answers),
        feedback: JSON.stringify(feedback),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to generate feedback:", error);
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
  }
}
