import { spyOn } from "bun:test";
import fs from "node:fs/promises";

export async function withWritingFiles(
  files: Record<string, string>,
  run: () => Promise<void>,
) {
  // Mock only disk I/O: the frontmatter parser, publication boundary and routes stay real.
  const list = spyOn(fs, "readdir").mockImplementation(async (dir) => {
    const dirStr = String(dir);
    // If files specifies keys starting with "en/", only return them for the "en" directory.
    // If files specifies keys starting with "fr/", only return them for the "fr" directory.
    // If keys don't specify a folder prefix, return them for "fr" by default.
    const hasPrefixedKeys = Object.keys(files).some(
      (k) => k.startsWith("fr/") || k.startsWith("en/"),
    );

    let matchingKeys: string[];
    if (hasPrefixedKeys) {
      const folder = dirStr.endsWith("en") ? "en/" : "fr/";
      matchingKeys = Object.keys(files)
        .filter((k) => k.startsWith(folder))
        .map((k) => k.replace(/^(fr|en)\//, ""));
    } else {
      // If flat, return all files for "fr" and empty for "en"
      matchingKeys = dirStr.endsWith("en") ? [] : Object.keys(files);
    }

    return matchingKeys.map((name) => ({
      name,
      isFile: () => true,
    })) as never;
  });

  const read = spyOn(fs, "readFile").mockImplementation(async (file) => {
    const name = String(file).split("/").at(-1) || "";
    if (name in files) {
      return files[name] as never;
    }
    const withFr = `fr/${name}`;
    const withEn = `en/${name}`;
    if (withFr in files) return files[withFr] as never;
    if (withEn in files) return files[withEn] as never;

    throw Object.assign(new Error(`Missing fixture: ${name}`), {
      code: "ENOENT",
    });
  });

  try {
    await run();
  } finally {
    list.mockRestore();
    read.mockRestore();
  }
}
