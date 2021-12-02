import { Options } from "../types";
import { abstractPathTranslator } from "../helpers/abstractPathTranslator";

export class Loaders {
    constructor(private options: Options) {
        this.options = options;
    }

    /**
     * joins the path of the root with the one received by parameter
     * @param {string} path
     * @private
     */
    private path(path: string): string {
        return this.options.root ? this.options.root.concat("/", path) : path;
    }

    /**
     * loads the error-handles in the selected path
     */
    public async loadErrorHandler(): Promise<void> {
        const exceptionHandlerPath = this.path(
            this.options.paths?.exception || "exceptions"
        );
        const files: string[] = abstractPathTranslator(exceptionHandlerPath);
        await Loaders.dynamicImport(files);
        console.info(`loaded ${files.length} errorHandlers`);
    }

    /**
     * imports the paths received for the decorators to be executed.
     * @param {string[]} files - file path array
     * @private
     */
    private static async dynamicImport(files: string[]): Promise<void> {
        for (let x = 0; x < files.length; x++) {
            await import(files[x]);
        }
    }

    /**
     * loads the controllers in the selected path
     */
    public async loadControllers(): Promise<void> {
        const controllersPath: string = this.path(
            this.options.paths?.controller || "controllers"
        );
        const files: string[] = abstractPathTranslator(controllersPath);
        await Loaders.dynamicImport(files);
        console.info(`loaded ${files.length} controllers`);
    }

    /**
     * loads the components in the selected path
     */
    public async loadComponents(): Promise<void> {
        const componentsPath: string = this.path(
            this.options.paths?.component || "components"
        );
        const files: string[] = abstractPathTranslator(componentsPath);
        await Loaders.dynamicImport(files);
        console.info(`loaded ${files.length} components`);
    }
}
