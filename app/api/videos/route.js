import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "videos.json");
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    return Response.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to load videos" },
      { status: 500 }
    );
  }
}
