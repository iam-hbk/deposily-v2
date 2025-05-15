import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { tools } from "@/lib/ai-tools";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system: "You are a friendly assistant!",
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}
