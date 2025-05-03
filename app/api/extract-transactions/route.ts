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

    // Extract transactions with AI
    const { text: extractionResult } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Analyze the following bank statement and extract all CREDIT transactions (money coming in).
        For each transaction, extract the date, description, and amount.
        
        Content:
        ${fileContent.substring(0, 4000)} // Limit content length for the prompt
        
        Format your response as a JSON array of objects with the following structure:
        [
          {
            "date": "YYYY-MM-DD",
            "description": "Transaction description",
            "amount": 123.45
          }
        ]
        
        Only include the JSON array in your response, nothing else.
      `,
    })

    // Parse the JSON response
    let transactions
    try {
      transactions = JSON.parse(extractionResult)
    } catch (error) {
      console.error("Failed to parse AI response:", error)
      return NextResponse.json({ error: "Failed to parse transactions" }, { status: 500 })
    }

    // In a real implementation, you would save these transactions to your database

    return NextResponse.json(
      {
        success: true,
        transactions,
        count: transactions.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error extracting transactions:", error)
    return NextResponse.json({ error: "Failed to extract transactions" }, { status: 500 })
  }
}
