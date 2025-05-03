import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file type
    const allowedTypes = ["application/pdf", "text/csv"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF and CSV files are supported" }, { status: 400 })
    }

    // Extract text from file
    // For PDF, you would use a library like pdf-parse
    // For CSV, you can use the built-in text() method
    let fileContent = ""

    if (file.type === "text/csv") {
      fileContent = await file.text()
    } else {
      // For PDF, this is a placeholder
      // In a real implementation, you would use a PDF parsing library
      fileContent = "Sample PDF content for demonstration"
    }

    // Validate with AI
    const { text: validationResult } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze the following content and determine if it appears to be a bank statement.
        Look for patterns like transaction dates, descriptions, amounts, and balance information.
        
        Content:
        ${fileContent.substring(0, 2000)} // Limit content length for the prompt
        
        Respond with ONLY "valid" if this appears to be a bank statement, or "invalid" followed by a brief reason if not.
      `,
    })

    const isValid = validationResult.toLowerCase().includes("valid")

    if (!isValid) {
      return NextResponse.json(
        {
          valid: false,
          reason: validationResult.replace("invalid", "").trim(),
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ valid: true }, { status: 200 })
  } catch (error) {
    console.error("Error validating statement:", error)
    return NextResponse.json({ error: "Failed to validate statement" }, { status: 500 })
  }
}
