import { readdirSync, statSync } from "fs";
import path from "path";

export function readDirRecursive(dir: string): string[] {
    const files: string[] = [];
    const list = readdirSync(dir);
    for (let x = 0; x < list.length; x++) {
        const filePath = path.join(dir, list[x]);
        const stats = statSync(filePath);
        if (stats.isDirectory()) files.push(...readDirRecursive(filePath));
        files.push(filePath);
    }
    return files;
}
