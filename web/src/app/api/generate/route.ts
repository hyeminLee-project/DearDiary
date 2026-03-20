import { NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT =
  "You are an emotional diary writer. Write calm, heartfelt diary entries in Notion style. Always include a 💡 Today's Thought section at the end. Keep it concise (under 200 words).";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

async function callLLM(prompt: string): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    max_tokens: 1024,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
  });
  return response.choices[0].message.content || "";
}

export async function POST(request: Request) {
  try {
    const { keywords, highlight } = await request.json();

    if (!keywords || !highlight) {
      return NextResponse.json(
        { error: "키워드와 하이라이트를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const [english, korean] = await Promise.all([
      callLLM(
        `Write a diary entry in ENGLISH only.\n\nKeywords: ${keywords}\nHighlight: ${highlight}`
      ),
      callLLM(
        `Write a diary entry in KOREAN only (한국어로만 작성).\n\nKeywords: ${keywords}\nHighlight: ${highlight}`
      ),
    ]);

    return NextResponse.json({
      english: english.trim(),
      korean: korean.trim(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Diary generation error:", errorMessage);

    let message: string;
    if (error instanceof OpenAI.AuthenticationError) {
      message = "API 키가 유효하지 않습니다.";
    } else if (error instanceof OpenAI.RateLimitError) {
      message = "API 요청 한도를 초과했습니다.";
    } else {
      message = `일기 생성 중 오류가 발생했습니다: ${errorMessage}`;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
