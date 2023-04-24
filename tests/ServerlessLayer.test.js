const { describe, before, after } = require('mocha');
const expect = require('chai').expect;
const fs = require('node:fs');
const path = require('node:path');

const root = "/tmp/sls-layer-env"

const LEVELS = Object.freeze( {
    one: "level-1",
    two: "level-2",
    three: "level-3",
});

before(function() {
    fs.mkdirSync(path.join(root, LEVELS.one, LEVELS.two, LEVELS.three), { recursive: true });

    fs.writeFileSync(path.join(root, LEVELS.one,  ".env"), "foobar=foo");
    fs.writeFileSync(path.join(root, LEVELS.one, LEVELS.two, ".env"), "foobar=bar");
    fs.writeFileSync(path.join(root, LEVELS.one, LEVELS.two, LEVELS.three, ".env"), "foobar=foobar");

    fs.writeFileSync(path.join(root, LEVELS.one,  ".env.dev"), "stage=dev")
    fs.writeFileSync(path.join(root, LEVELS.one,  ".env.prod"), "stage=prod")

})

after(function() {
    fs.rmSync(root, { recursive: true });
})

describe("Serverless Layer", function() {
    it("should be able to run", function() {
        expect(true).to.equal(true);
    })
})