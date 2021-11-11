import { existsSync, readdirSync, statSync } from "fs";
import { IFile } from "../types";
import * as Path from "path";
import { filterAbstract } from "./filterAbstract";
import { readDirRecursive } from "./readDirRecursive";

/**
 * translates an abstract path into real file paths
 * @param path
 */
export function abstractPathTranslator(path: string): string[] {
    const files = new Array<string>();
    const splatted: string[] = path.split("**");
    const base: string = splatted[0];
    if (base.includes("*.")) {
        const splattedBase = base.split(/[\\/]/);
        const extension = splattedBase.pop();
        if (existsSync(splattedBase.join("\\"))) {
            const list: string[] = readdirSync(splattedBase.join("\\"));
            list.forEach((f) => {
                const splattedFile = f.split(".");
                const file: IFile = {
                    name: splattedFile[0],
                    ext: splattedFile[1],
                };
                if (file.ext === extension?.split(".")[1]) {
                    files.push(splattedBase.join("\\").concat("\\", f));
                }
            });
        }
    } else if (base.includes("**")) {
        const list: string[] = readdirSync(base);
        list.forEach((f) => {
            const filePath: string = Path.join(base, f);
            const stats = statSync(filePath);
            if (stats.isDirectory()) {
                files.push(
                    ...abstractPathTranslator(
                        filePath.concat(
                            ...filterAbstract(splatted),
                            <string>splatted[splatted.length - 1]
                        )
                    )
                );
            }
        });
    } else {
        files.push(...readDirRecursive(base));
    }

    return files;
}
