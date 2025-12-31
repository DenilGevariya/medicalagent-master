import { openai } from '@/config/OpenAiModel';
import { NextRequest, NextResponse } from 'next/server';

const IMAGE_ANALYSIS_PROMPT = `You are an AI Medical Image Analysis Assistant. Analyze the provided health-related image (such as skin conditions, wounds, rashes, injuries, or other visible health concerns) and provide a detailed medical assessment.

Based on the image, generate a structured analysis with the following fields:

1. condition: A brief description of what you observe in the image (e.g., "Possible contact dermatitis", "Minor laceration", "Insect bite")
2. severity: Rate the severity as "Mild", "Moderate", or "Severe"
3. symptoms: List of visible symptoms observed in the image (e.g., redness, swelling, discoloration)
4. possibleCauses: List of potential causes for the condition
5. recommendations: List of care recommendations (include when to seek medical attention)
6. urgencyLevel: "Immediate medical attention required", "See a doctor within 24-48 hours", or "Monitor and self-care appropriate"
7. disclaimer: A medical disclaimer statement

IMPORTANT RULES:
- Be thorough but not alarmist
- Always recommend professional medical consultation for serious conditions
- If the image doesn't appear to be deep/serious, mention quick action was taken
- Provide practical, actionable advice
- Be empathetic and supportive in tone

Return the result in this JSON format:
{
  "condition": "string",
  "severity": "Mild | Moderate | Severe",
  "symptoms": ["symptom1", "symptom2"],
  "possibleCauses": ["cause1", "cause2"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "urgencyLevel": "string",
  "disclaimer": "This analysis is for informational purposes only and does not replace professional medical diagnosis. Please consult a healthcare provider for proper evaluation and treatment."
}

Only include valid fields. Respond with nothing else.`;

export async function POST(req: NextRequest) {
  try {
    const { image, fileName } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Call OpenAI Vision API with GPT-4 Vision or Gemini Vision
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001', // or use 'gpt-4-vision-preview' for OpenAI
      messages: [
        {
          role: 'system',
          content: IMAGE_ANALYSIS_PROMPT,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please analyze this health-related image and provide a detailed assessment.',
            },
            {
              type: 'image_url',
              image_url: {
                url: image, // base64 encoded image
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    });

    const rawResp = completion.choices[0].message;
    //@ts-ignore
    const Resp = rawResp.content
      .trim()
      .replace('```json', '')
      .replace('```', '');
    
    const jsonResp = JSON.parse(Resp);

    return NextResponse.json(jsonResp);
  } catch (error: any) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze image',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
