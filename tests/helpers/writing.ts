import { spyOn } from "bun:test";
import fs from "node:fs/promises";

export async function withWritingFiles(
  files: Record<string, string>,
  run: () => Promise<void>,
) {
  // Mock only disk I/O: the frontmatter parser, publication boundary and routes stay real.
  const list = spyOn(fs, "readdir").mockResolvedValue(
    Object.keys(files).map((name) => ({ name, isFile: () => true })) as never,
  );
  const read = spyOn(fs, "readFile").mockImplementation(async (file) => {
    const name = String(file).split("/").at(-1) || "";
    if (!(name in files))
      throw Object.assign(new Error("Missing fixture"), { code: "ENOENT" });
    return files[name] as never;
  });
  try {
    await run();
  } finally {
    list.mockRestore();
    read.mockRestore();
  }
}
