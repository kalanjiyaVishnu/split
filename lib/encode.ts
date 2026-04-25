import LZString from "lz-string";

export type DiffConfig = {
  left: string;
  right: string;
  fileType: "json" | "text" | "yaml" | "markdown";
  label?: string;
  commentsEnabled: boolean;
  createdAt: string;
};

export function encodeConfig(config: DiffConfig): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(config));
}

export function decodeConfig(hash: string): DiffConfig | null {
  try {
    const decoded = LZString.decompressFromEncodedURIComponent(hash);
    if (!decoded) return null;
    return JSON.parse(decoded) as DiffConfig;
  } catch (err) {
    return null;
  }
}
