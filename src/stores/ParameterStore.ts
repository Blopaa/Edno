import { ParamDef } from "../types";

class ParameterStore {
    private parameters = new Map<string, ParamDef[]>();

    /**
     * stores parameters
     * @param {ParamDef} parameter - parameter to store
     */
    public registerParameter(parameter: ParamDef): void {
        const key = `${parameter.target}-${parameter.propertyKey}`;
        const currentValue = this.parameters.get(key);
        if (!currentValue) {
            this.parameters.set(key, [parameter]);
        } else {
            this.parameters.set(key, currentValue.concat(parameter));
        }
    }

    /**
     * return endpoint parameter array from given key
     * @param {string} key - key to find parameters
     */
    public getParameters(key: string) {
        return this.parameters.get(key);
    }
}

const parameterStore = new ParameterStore();
export default parameterStore;
