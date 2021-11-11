import { Options } from "../types";
import { abstractPathTranslator } from "../helpers/abstractPathTranslator";

export class Loaders {
    constructor(private options: Options) {
        this.options = options;
    }

    private path(path: string): string {
        return this.options.root ? this.options.root.concat("/", path) : path;
    }

    public async loadErrorHandler(): Promise<void> {
        const exceptionHandlerPath = this.path(
            this.options.paths?.exception || "exceptions"
        );
        const files: string[] = abstractPathTranslator(exceptionHandlerPath);
        await Loaders.dynamicImport(files);
        console.info(`loaded ${files.length} errorHandlers`);
    }

    private static async dynamicImport(files: string[]): Promise<void> {
        for (let x = 0; x < files.length; x++) {
            await import(files[x]);
        }
    }

    public async loadControllers(): Promise<void> {
        const controllersPath: string = this.path(
            this.options.paths?.controller || "controllers"
        );
        const files: string[] = abstractPathTranslator(controllersPath);
        await Loaders.dynamicImport(files);
        console.info(`loaded ${files.length} controllers`);
    }

    public async loadComponents(): Promise<void> {
        const componentsPath: string = this.path(
            this.options.paths?.component || "components"
        );
        const files: string[] = abstractPathTranslator(componentsPath);
        await Loaders.dynamicImport(files);
        console.info(`loaded ${files.length} components`);
    }
}
