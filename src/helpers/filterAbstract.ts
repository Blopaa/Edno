/**
 * prevent mistake excludes of abstract path
 * @param filePaths
 */
export function filterAbstract(filePaths: string[]): string[] {
    const filter = new Array<string>();
    filePaths.forEach((filePath) => {
        if (filePath === "/") {
            filter.push("\\" + "**");
        }
    });
    return filter;
}
