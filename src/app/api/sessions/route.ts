import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateContent } from "@/lib/generation/mock";
import { CoachMode } from "@/lib/generation/types";

// GET /api/sessions - list all sessions
export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

// POST /api/sessions - create a new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, title, level, focus } = body;

    if (!mode || !title || !level) {
      return NextResponse.json(
        { error: "mode, title, and level are required" },
        { status: 400 }
      );
    }

    // Generate mock prompts
    const content = generateContent({
      mode: mode as CoachMode,
      title,
      level,
      focus: focus ?? "",
    });

    const session = await prisma.session.create({
      data: {
        mode,
        title,
        level,
        focus: focus ?? "",
        prompts: JSON.stringify(content.prompts),
        answers: JSON.stringify({}),
        feedback: JSON.stringify({}),
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Failed to create session:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
