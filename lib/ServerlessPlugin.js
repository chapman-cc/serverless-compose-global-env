"use strict";
const serverless = require("serverless");
const ServerlessLayer = require("./ServerlessLayer");

/**
 * ServerlessPlugin class
 * @param {serverless.Serverless} serverless
 * @param {serverless.Options} options
 */
module.exports = class ServerlessPlugin {
  constructor(serverless, options) {
    this._serverless = serverless;
    this._options = options;
    this.hooks = {
      initialize: () => this.initialize(),
    };
  }

  //  * Initialize the plugin

  async initialize() {
    const layerHandler = new ServerlessLayer();
    await layerHandler.readEnvFiles();
    layerHandler.env;
  }
};
