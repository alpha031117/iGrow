// pdf-parse has a quirk where its index.js loads test fixtures; import the lib directly to avoid it
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse/lib/pdf-parse") as (
  buffer: Buffer,
  options?: Record<string, unknown>
) => Promise<{ text: string; numpages: number }>;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (file.type === "application/pdf") {
      const data = await pdfParse(buffer);
      return Response.json({ text: data.text.trim(), pages: data.numpages });
    }

    // Plain text / CSV — decode directly
    const text = new TextDecoder().decode(buffer);
    return Response.json({ text: text.trim() });
  } catch (err) {
    console.error("[extract-text]", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
