import { existsSync, readdirSync, statSync } from "fs";
import path from "path";

/**
 * reads all files inside given path
 * @param dir
 */
export function readDirRecursive(dir: string): string[] {
    const files: string[] = [];
    if (existsSync(dir)) {
        const list = readdirSync(dir);
        for (let x = 0; x < list.length; x++) {
            const filePath = path.join(dir, list[x]);
            const stats = statSync(filePath);
            if (stats.isDirectory()) {
                files.push(...readDirRecursive(filePath));
            } else {
                files.push(filePath);
            }
        }
    }
    return files;
}
