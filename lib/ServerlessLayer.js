const fs = require("node:fs");
const path = require("node:path");

module.exports = class ServerlessLayer {
  /**
     * @class ServerlessLayer
     * @description aggregate all .env files values
     * 
     * @param {string} serviceRoot
     * @param {string} stage
     
     * @property {Record<string, string>} _env
     * @property {string} _serviceRoot
     * @property {string} _stage
     * @property {string[]} _envFiles
    */
  constructor(serviceRoot, stage) {
    this._env = {};
    this._serviceRoot = serviceRoot;
    this._stage = stage;
    this._envFiles = [];
  }

  get env() {
    return this._env;
  }

  /**
   * find all .env files
   * @returns {void}
   */
  async reverseFindEnvFiles() {
    const dirHierarchy = this._serviceRoot.slice(1).split("/");
    for (let i = 0; i < dirHierarchy.length; i++) {
      const dir = path.resolve("/", ...dirHierarchy);
      const files = fs.readdirSync(dir);
      if (files.includes(".env." + this._stage)) {
        this._envFiles.push(path.join(dir, ".env." + this._stage));
      }
      if (files.includes(".env")) {
        this._envFiles.push(path.join(dir, ".env"));
      }

      if (files.includes("serverless-compose.yml")) {
        break;
      }
      dirHierarchy.pop();
    }
  }

  /**
   * read all .env files values
   * @returns {void}
   */
  async readEnvFiles() {
    if (this._envFiles.length === 0) {
      this.reverseFindEnvFiles();
    }

    this._env = this._envFiles.reverse().reduce((env, file) => {
      fs.readFileSync(file, "utf8")
        .split("\n")
        .filter((line) => line.length > 0)
        .filter((line) => !line.startsWith("#"))
        .map((line) => line.split("="))
        .map(([k, v]) => [k, v.trim()])
        .forEach(([k, v]) => (env[k] = this._parseEnv(v)));
      return env;
    }, {});
  }

  /**
   * parse strings to js types
   * @param {string} value
   * @returns {any}
   */
  parseEnv(v) {
    if (v.match(/^true$/i)) return true;
    if (v.match(/^false$/i)) return false;
    if (v.match(/^null$/i)) return null;
    if (v.match(/^undefined$/i)) return undefined;
    if (v.match(/^[0-9]+$/)) return parseInt(v);
    if (v.match(/^[0-9]+\.[0-9]+$/)) return parseFloat(v);
    if (v.match(/^"(.*)"$/)) return v.replace(/^"(.*)"$/, "$1");
    if (v.match(/^'(.*)'$/)) return v.replace(/^'(.*)'$/, "$1");
    if (v.match(/^{(.*)}$/)) return JSON.parse(v);
    return v;
  }
};
