// biome-ignore lint/suspicious/noControlCharactersInRegex: XML 1.0 forbids these characters, including as entities.
const INVALID_XML = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g;

export function escapeXml(value: string): string {
  return (
    value
      // XML 1.0 excludes these control characters even when entity encoded.
      .replace(INVALID_XML, "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
  );
}
