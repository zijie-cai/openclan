import { GoogleGenAI, Type } from "@google/genai";
import { Utterance } from "../types";

const getMediaDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const media = document.createElement(file.type.startsWith('video/') || file.name.endsWith('.mp4') ? 'video' : 'audio');
    media.onloadedmetadata = () => {
      resolve(media.duration * 1000);
      URL.revokeObjectURL(url);
    };
    media.onerror = () => {
      resolve(0); // fallback
      URL.revokeObjectURL(url);
    };
    media.src = url;
  });
};

export async function transcribeAudio(
  file: File,
  apiKey: string,
  onProgress: (progress: number) => void
): Promise<Utterance[]> {
  if (!apiKey) {
    throw new Error("Missing Gemini API key.");
  }

  onProgress(10);
  
  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey });

  // Get media duration
  const durationMs = await getMediaDuration(file);

  // Convert file to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  onProgress(30);

  const prompt = `You are an expert Speech-Language Pathologist and transcriptionist.
Please transcribe the provided audio/video file.
The total length of the media file is ${durationMs > 0 ? Math.round(durationMs) + ' milliseconds' : 'unknown'}. 
CRITICAL: Ensure your timestamps are strictly accurate to the actual audio. The startTime and endTime MUST be in milliseconds, and MUST NOT exceed the total length of the media file.

Identify the different speakers. If one sounds like a patient with aphasia, label them *PAR. If one sounds like an investigator/clinician, label them *INV. If unsure, use *SPK1, *SPK2, etc.
For EVERY SINGLE utterance, you MUST provide:
- speaker: The speaker label (*PAR, *INV, etc.)
- text: The exact transcribed text. Include pauses or fillers if any.
- startTime: start time in format "MM:SS.mmm" or "HH:MM:SS.mmm" (e.g., "01:23.450")
- endTime: end time in format "MM:SS.mmm" or "HH:MM:SS.mmm" (e.g., "01:25.100")
- confidence: your confidence in the transcription (0.0 to 1.0)
- mor: The morphological tier (%mor) in CLAN format for this utterance (e.g., "pro:sub|I v|have det:art|a n|dog ."). You MUST generate this for every utterance.
- err: The error tier (%err) in CLAN format, if the patient made any paraphasias or grammatical errors. Leave empty if no errors.
- gra: The grammatical relations tier (%gra) in CLAN format for this utterance (e.g., "1|2|SUBJ 2|0|ROOT 3|4|DET 4|2|OBJ 5|2|PUNCT"). You MUST generate this for every utterance.

Return a JSON array of these utterance objects.`;

  onProgress(50);

  let mimeType = file.type;
  if (!mimeType) {
    if (file.name.endsWith('.mp4')) mimeType = 'video/mp4';
    else if (file.name.endsWith('.wav')) mimeType = 'audio/wav';
    else if (file.name.endsWith('.mp3')) mimeType = 'audio/mp3';
    else mimeType = 'audio/wav'; // fallback
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: "You are an expert transcriptionist. You MUST provide highly accurate start and end timestamps for every utterance. Timestamps must perfectly match the audio and must be in MM:SS.mmm format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              speaker: { type: Type.STRING, description: "Speaker label, e.g., *PAR or *INV" },
              text: { type: Type.STRING, description: "Transcribed text" },
              startTime: { type: Type.STRING, description: "Start time in MM:SS.mmm format" },
              endTime: { type: Type.STRING, description: "End time in MM:SS.mmm format" },
              confidence: { type: Type.NUMBER, description: "Confidence score between 0.0 and 1.0" },
              mor: { type: Type.STRING, description: "Morphological tier (%mor) in CLAN format" },
              err: { type: Type.STRING, description: "Error tier (%err) in CLAN format (empty if none)" },
              gra: { type: Type.STRING, description: "Grammatical relations tier (%gra) in CLAN format" }
            },
            required: ["speaker", "text", "startTime", "endTime", "confidence", "mor", "gra"]
          }
        }
      }
    });

    onProgress(90);

    const jsonStr = response.text || "[]";
    const data = JSON.parse(jsonStr);

    const parseTime = (timeStr: string | number): number => {
      if (typeof timeStr === 'number') return timeStr;
      if (!timeStr) return 0;
      const parts = timeStr.toString().split(':');
      if (parts.length === 3) {
        const hr = parseInt(parts[0], 10) || 0;
        const min = parseInt(parts[1], 10) || 0;
        const secParts = parts[2].split('.');
        const sec = parseInt(secParts[0], 10) || 0;
        const ms = secParts[1] ? parseInt(secParts[1].padEnd(3, '0').substring(0, 3), 10) : 0;
        return (hr * 3600 + min * 60 + sec) * 1000 + ms;
      } else if (parts.length === 2) {
        const min = parseInt(parts[0], 10) || 0;
        const secParts = parts[1].split('.');
        const sec = parseInt(secParts[0], 10) || 0;
        const ms = secParts[1] ? parseInt(secParts[1].padEnd(3, '0').substring(0, 3), 10) : 0;
        return (min * 60 + sec) * 1000 + ms;
      }
      return parseInt(timeStr, 10) || 0;
    };

    const utterances: Utterance[] = data.map((item: any) => {
      const dependentTiers = [];
      if (item.mor) dependentTiers.push({ type: '%mor:', text: item.mor });
      if (item.err) dependentTiers.push({ type: '%err:', text: item.err });
      if (item.gra) dependentTiers.push({ type: '%gra:', text: item.gra });

      let start = parseTime(item.startTime);
      let end = parseTime(item.endTime);

      if (durationMs > 0) {
        if (start > durationMs) start = durationMs - 1000;
        if (end > durationMs) end = durationMs;
        if (start < 0) start = 0;
        if (end <= start) end = start + 1000;
      }

      return {
        id: Math.random().toString(36).substring(7),
        speaker: item.speaker,
        text: item.text,
        timestamp: [start, end],
        confidence: item.confidence,
        dependentTiers,
        metrics: { mlu: item.text.split(' ').length, typeTokenRatio: 1, errors: item.err ? [item.err] : [] },
        aiSuggestions: []
      };
    });

    onProgress(100);
    return utterances;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
}
