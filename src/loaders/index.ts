import { existsSync } from "fs";
import { readDirRecursive } from "../helpers/readDirRecursive";
import { Options } from "../types/route";

export class Loaders {

    constructor(private options: Options) {
        this.options = options;
    }

    private path(path: string): string {
        return this.options.root ? this.options.root.concat("/", path) : path;
    }

    public async loadErrorHandler(): Promise<void> {
        const exceptionHandlerPath = this.options.exceptionPath;
        if (!exceptionHandlerPath) return;
        if (!existsSync(exceptionHandlerPath)) return;
        const files = readDirRecursive(exceptionHandlerPath);
        await Loaders.dynamicImport(files);
        console.info(`loaded ${files.length} errorHandlers`);
    }

    private static async dynamicImport(files: string[]): Promise<void> {
        for (let x = 0; x < files.length; x++) {
            await import(files[x]);
        }
    }

    public async loadControllers(): Promise<void> {
        const controllersPath: string = this.path("controllers");
        if (!existsSync(controllersPath)) return;
        const files = readDirRecursive(controllersPath);
        await Loaders.dynamicImport(files);
        console.info(`loaded ${files.length} controllers`);
    }
}
