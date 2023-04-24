const { describe, before, after } = require("mocha");
const expect = require("chai").expect;
const fs = require("node:fs");
const path = require("node:path");
const ServerlessLayer = require("../lib/ServerlessLayer");

const root = "/tmp/sls-layer-env";

const LEVELS = Object.freeze({
  one: "level-1",
  two: "level-2",
  three: "level-3",
});

before(function () {
  fs.mkdirSync(path.join(root, LEVELS.one, LEVELS.two, LEVELS.three), {
    recursive: true,
  });

  fs.writeFileSync(path.join(root, LEVELS.one, ".env"), "foobar=foo");
  fs.writeFileSync(
    path.join(root, LEVELS.one, LEVELS.two, ".env"),
    "foobar=bar"
  );
  fs.writeFileSync(
    path.join(root, LEVELS.one, LEVELS.two, LEVELS.three, ".env"),
    "foobar=foobar"
  );

  fs.writeFileSync(path.join(root, LEVELS.one, ".env.dev"), "stage=dev");
  fs.writeFileSync(path.join(root, LEVELS.one, ".env.prod"), "stage=prod");
});

after(function () {
  fs.rmSync(root, { recursive: true });
});

describe("Serverless Layer", function () {
  it("should load all env files", async function () {

    // assume the lambda is nested in deepest level
    const dir = path.resolve(root, LEVELS.one, LEVELS.two, LEVELS.three);
    const layer = new ServerlessLayer(dir, "prod");
    await layer.readEnvFiles();
   
    const env = layer.env;
   
    expect(env).to.haveOwnProperty("foobar");
    expect(env).to.haveOwnProperty("stage");

    expect(env.foobar).to.equal("foobar");
    expect(env.stage).to.equal("prod");
  });
});
