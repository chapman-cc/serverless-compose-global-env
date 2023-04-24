"use strict";
const serverless = require("serverless");
const ServerlessLayer = require("./ServerlessLayer");

module.exports = class ServerlessPlugin {
  /**
   * ServerlessPlugin class
   * @param {serverless.Serverless} serverless
   * @param {serverless.Options} options
   */
  constructor(serverless, options) {
    this._serverless = serverless;
    this._options = options;
    this.hooks = {
      initialize: () => this.initialize(),
    };
  }

  //  * Initialize the plugin
  async initialize() {
   const stage =  this._serverless.getProvider("aws").getStage();
    const dir = this._serverless.serviceDir;
    const layerHandler = new ServerlessLayer(dir,stage );
    await layerHandler.readEnvFiles();

    const serverlessYamlEnv = this._serverless.service.provider.environment || {};
    this._serverless.service.provider.environment = Object.assign({}, layerHandler.env, serverlessYamlEnv);
  }
};
