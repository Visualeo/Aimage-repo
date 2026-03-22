import { NextRequest } from "next/server";

const STYLE_TEMPLATES: Record<string, string> = {
  cinematic:
    "cinematic lighting, ultra realistic, 35mm film, dramatic shadows, film grain",
  anime:
    "anime style, vibrant colors, detailed illustration, cel shading, Studio Ghibli quality",
  realistic:
    "photorealistic, high detail, 8k resolution, natural lighting, sharp focus",
  cyberpunk:
    "cyberpunk style, neon lights, futuristic city, rain-soaked streets, holographic displays",
  "oil painting":
    "oil painting, textured brush strokes, classical art, impasto technique, museum quality",
  fantasy:
    "fantasy art, magical atmosphere, epic scene, ethereal lighting, detailed world-building",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style } = body as {
      prompt: string;
      style: string;
    };

    if (!prompt || !prompt.trim()) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const hfToken = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_TOKEN;
    if (!hfToken || hfToken.includes("your_")) {
      return Response.json(
        {
          error:
            "Hugging Face API key not configured. Please add HUGGINGFACE_API_KEY to your .env.local file.",
        },
        { status: 503 }
      );
    }

    const styleKey = style?.toLowerCase() ?? "realistic";
    const styleTemplate =
      STYLE_TEMPLATES[styleKey] ?? STYLE_TEMPLATES["realistic"];
    const finalPrompt = `${styleTemplate}, ${prompt.trim()}`;

    console.log(`[HF API] Generating image with prompt: ${finalPrompt}`);

    const models = [
      "black-forest-labs/FLUX.1-schnell",
      "stabilityai/stable-diffusion-xl-base-1.0",
      "runwayml/stable-diffusion-v1-5",
    ];

    let response: Response | null = null;
    let selectedModel = "";
    let lastErrorData = "";

    for (const modelId of models) {
      selectedModel = modelId;
      console.log(`[HF API] Attempting generation with model: ${selectedModel}`);
      const routerUrl = `https://router.huggingface.co/hf-inference/models/${selectedModel}`;
      
      try {
        response = await fetch(routerUrl, {
          headers: {
            Authorization: `Bearer ${hfToken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ 
            inputs: finalPrompt,
            options: { wait_for_model: true }
          }),
        });

        if (response.ok) {
          console.log(`[HF API] Successfully generated image with ${selectedModel}`);
          break;
        }

        const errorData = await response.text();
        lastErrorData = errorData;
        console.warn(`[HF API] Model ${selectedModel} returned status ${response.status}: ${errorData}`);
        
        // If it's 401/403 (auth) or 404 (absent), or 410, continue to next model
        if ([401, 403, 404, 410].includes(response.status)) {
          continue;
        } else if (response.status === 503) {
          // Model is loading, try next one for speed
          continue;
        } else {
          // Other error, try next
          continue;
        }
      } catch (err) {
        console.error(`[HF API] Fetch error for model ${selectedModel}:`, err);
        continue;
      }
    }

    if (!response || !response.ok) {
      const status = response?.status || 500;
      console.error("[HF API] All models failed. Last error:", lastErrorData);
      
      return Response.json(
        { error: `Generation failed across all models. Last error: ${lastErrorData || "Unknown error"}` },
        { status: status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    
    // Determine mime type (default to jpeg as it's common for SD)
    // HF usually returns image/jpeg or image/png
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const dataUrl = `data:${contentType};base64,${base64Image}`;

    return Response.json({ image: dataUrl });
  } catch (err: unknown) {
    console.error("[generate-image] Error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
