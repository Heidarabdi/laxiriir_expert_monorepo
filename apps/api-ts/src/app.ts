import { config as loadEnvironment } from "dotenv";

loadEnvironment({ path: new URL("../.env.local", import.meta.url) });
loadEnvironment({ path: new URL("../.env", import.meta.url) });

await import("./start.js");
