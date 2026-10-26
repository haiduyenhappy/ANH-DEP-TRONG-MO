import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface GenerationParams {
  image: string; // base64
  concept: string;
  aspectRatio: "1:1" | "16:9" | "9:16";
  gender: "Female" | "Male";
  customStyle?: string;
  randomPose?: boolean;
}

export const STYLES = [
  {
    id: "evening_dress",
    name: "Dạ hội sang trọng",
    icon: "🌹",
    description: "Luxurious red evening gown in an elegant ballroom",
    prompt: "Outfit: luxurious red evening gown. Scene: elegant ballroom with flowers and golden lights. Pose: standing gracefully holding a champagne glass."
  },
  {
    id: "lotus_flower",
    name: "Hoa sen",
    icon: "🪷",
    description: "White Vietnamese ao dai at a lotus pond",
    prompt: "Outfit: white Vietnamese ao dai. Scene: lotus pond at sunrise. Pose: gently holding pink lotus flowers."
  },
  {
    id: "wedding_dress",
    name: "Áo cưới",
    icon: "👰",
    description: "Elegant wedding gown by a waterfall",
    prompt: "Ultra hyper-realistic cinematic wedding photography, 8K resolution, vertical 9:16. A young bride standing gracefully in front of a majestic waterfall, surrounded by lush green foliage and delicate white flowers. She is wearing an elegant ivory strapless wedding gown with lace and floral embroidery, flowing A-line silhouette with soft tulle layers. A long sheer veil drapes naturally behind her. She holds a small white bridal bouquet with fresh greenery. Her pose is gentle, body turned slightly to the side, looking calmly to the left. IMPORTANT: Use the uploaded reference image as the exact facial identity. Preserve original facial vector, facial structure, age, skin tone, eye shape, nose, lips, expression, and proportions. No stylization, no beautification, no facial modification. Soft natural diffused outdoor lighting, mist from the waterfall in the background. Shallow depth of field, fine-art wedding portrait style. Extremely sharp focus, ultra-detailed textures, photorealistic realism. Negative prompt: cartoon, anime, illustration, painting, low resolution, blurry, soft focus, face distortion, altered identity, different face, over-beautified face, plastic skin, harsh lighting, strong shadows, bad anatomy, extra limbs or fingers, text, watermark, logo"
  },
  {
    id: "sunflower",
    name: "Hoa hướng dương",
    icon: "🌻",
    description: "Summer yellow dress in a sunflower field",
    prompt: "Ultra-realistic cinematic photograph of a beautiful young woman standing in a sunflower field during summer. She has natural smooth skin with light, elegant makeup, soft pink blush, and bright expressive eyes. Her long natural hair flows gently in the wind. She wears a soft white vintage countryside dress and a wide straw hat. She stands among blooming sunflowers, her body slightly turned sideways while she looks back toward the camera with a gentle, warm smile. Beside her is a vintage bicycle with a basket full of fresh sunflowers. Scene: large sunflower field in full bloom, bright yellow sunflowers with lush green leaves. Composition: sunflowers in foreground and background creating cinematic depth, shallow depth of field with soft background blur. Lighting: natural soft daylight with warm pastel tones, romantic countryside atmosphere. Camera: professional DSLR photography, 85mm portrait lens, f1.8 aperture, cinematic color grading. Quality: ultra-realistic, 8K resolution, highly detailed skin texture."
  },
  {
    id: "rice_field",
    name: "Cánh đồng lúa",
    icon: "🌾",
    description: "Portrait in a golden rice field",
    prompt: "Ultra-realistic cinematic photograph of a young Vietnamese woman standing in a golden rice field. She smiles brightly with lively eyes. Light, natural makeup with porcelain skin, soft pink blush, glossy peach-pink lips. Long dark brown hair styled in a loose side braid falling over one shoulder. Outfit: fresh young banana-leaf green traditional Vietnamese áo dài made of soft silk chiffon, matching silk trousers. She gently holds a bundle of ripe rice stalks. Scene: wide golden rice fields with a small hill and tall green pine trees in the distance, deep blue sky. Natural golden hour sunlight, warm cinematic lighting. Low-angle photography."
  },
  {
    id: "pigeon",
    name: "Chim bồ câu",
    icon: "🕊️",
    description: "Elegant portrait with white doves",
    prompt: "Ultra-realistic artistic portrait of a Vietnamese woman sitting peacefully in a green park surrounded by white doves. Soft sweet expression with slightly parted lips. Clear porcelain skin with Douyin-style natural makeup. Long dark hair braided loosely and placed over one shoulder. Outfit: deep royal blue traditional Vietnamese áo dài, loose flowing silhouette, soft chiffon fabric. Small delicate flower crown on her head. She sits gracefully on a tree trunk in a peaceful green park while white pigeons stand and walk nearby. Soft green forest background. Soft natural daylight with dreamy cinematic tone. Artistic portrait photography, fairy-tale feeling."
  },
  {
    id: "high_fashion",
    name: "Áo dài truyền thống",
    icon: "👑",
    description: "Traditional Vietnamese ao dai portrait",
    prompt: "Ultra-realistic 8K high-fashion editorial portrait of a young Vietnamese woman. Porcelain white smooth skin, elegant soft pink makeup, glossy red lips. Long thick dark brown-black hair styled in a classic half-up style with soft waves. Outfit: soft mint green traditional Vietnamese áo dài made from high-quality satin silk, light pink silk trousers. White orchid flower branch in one hand, classic pearl necklace. Elegant fashion pose, eye-level professional fashion photography. Scene: outdoor heritage location with traditional Vietnamese architecture, small ancient pavilion, stone bridge and water elements. Soft natural daylight with cinematic lighting."
  },
  {
    id: "ethnic_costume",
    name: "Trang phục dân tộc",
    icon: "🏮",
    description: "Traditional ethnic costume with headpiece",
    prompt: "Ultra-high-resolution 8K, vertical 9:16. Use the uploaded reference photo as the photorealistic face source. Preserve the original facial vector, identity, facial structure, age, expression, and skin tone. A young woman in traditional ethnic costume photographed outdoors. She is wearing a LARGE TRADITIONAL EMBROIDERED HEADPIECE (MANDATORY), a colorful ethnic headdress with woven patterns and fabric layers covering the top of the head, thick fabric folds on both sides, vivid multicolor embroidery — clearly visible and dominant. Outfit: White lace puff-sleeve blouse, black skirt with colorful embroidered belt. Multiple layered silver necklaces and chest ornaments. Decorative jewelry chain on the waist. Pose: She is smiling softly, holding a light-green paper parasol with floral patterns in her right hand, left arm gently extended to the side. Lighting: Bright natural daylight with soft cinematic lighting. Environment: Mountain landscape and green trees softly blurred in the background (strong bokeh). Image quality: Photorealistic fabric texture, realistic colors, sharp focus, 8K. Negative prompt: do not remove headpiece, no missing headwear, no simplified hair, no hair-only head, no hat replacement, no cap, no modern hat, no cartoon, no illustration, no anime, no 3D render, no face morphing, no identity change, no duplicate people, no text, no watermark, no logos"
  },
  {
    id: "male_vest",
    name: "Nam thần vest",
    icon: "👔",
    description: "Handsome man in a luxury suit",
    prompt: "Outfit: luxury tailored black suit with a white shirt. Scene: high-end modern office or luxury lounge. Pose: adjusting cufflinks or looking sharp."
  },
  {
    id: "male_cinematic",
    name: "Nam thần điện ảnh",
    icon: "🎬",
    description: "Handsome man in cinematic style",
    prompt: "Outfit: stylish leather jacket and dark jeans. Scene: urban street at night with neon lights and rain. Pose: leaning against a wall, cinematic mood."
  },
  {
    id: "male_outdoor",
    name: "Nam thần ngoài trời",
    icon: "🏔️",
    description: "Handsome man in outdoor setting",
    prompt: "Outfit: casual outdoor gear or a simple white t-shirt. Scene: breathtaking mountain view or forest trail. Pose: looking into the distance, natural vibe."
  }
];

export async function generateAIPhotos(params: GenerationParams): Promise<string[]> {
  const { image, concept, aspectRatio, gender, customStyle, randomPose } = params;
  const style = STYLES.find(s => s.id === concept) || STYLES[0];

  const generateSingle = async (index: number) => {
    const posePrompt = randomPose ? "dynamic natural pose, different from usual" : "dynamic natural pose";
    const customStylePrompt = customStyle ? `Additional style: ${customStyle}` : "";
    
    const fullPrompt = `Ultra-realistic cinematic portrait of the SAME person from the uploaded image.

Face:
preserve 100% facial identity
same facial vector
identical face structure
no facial modification

Gender:
${gender}

${style.prompt}

Pose:
${posePrompt} (Variation ${index})

${customStylePrompt}

Lighting:
cinematic natural lighting

Quality:
ultra-detailed
8K resolution
photorealistic`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: image.split(',')[1], // Remove data:image/png;base64,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  };

  // Generate 2 images in parallel
  const results = await Promise.all([
    generateSingle(1),
    generateSingle(2)
  ]);

  return results;
}
