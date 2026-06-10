import { promises as fs } from "node:fs";
import path from "node:path";

const ASSETS_DIR =
  "C:/Users/Administrator/.cursor/projects/g-TechItNext-Projects-Frontend-moto-vessel-frontend/assets";

export async function GET() {
  try {
    const entries = await fs.readdir(ASSETS_DIR);
    const candidates = entries
      .filter((file) => file.toLowerCase().includes("main-") && file.toLowerCase().endsWith(".png"))
      .map((file) => path.join(ASSETS_DIR, file));

    if (!candidates.length) {
      return new Response("Reference image not found", { status: 404 });
    }

    const filesWithStats = await Promise.all(
      candidates.map(async (filePath) => ({
        filePath,
        stat: await fs.stat(filePath),
      })),
    );
    const latest = filesWithStats.sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs)[0].filePath;
    const imageBuffer = await fs.readFile(latest);

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("Unable to load reference image", { status: 500 });
  }
}
