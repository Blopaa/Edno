import { Edno } from "../src/edno";

const edno = new Edno({
    port: 3001,
    root: __dirname,
    paths: {
        exception: "/exceptions/handlers"
    }
});
edno.start(() => {
    console.log("running on port 3001");
});
