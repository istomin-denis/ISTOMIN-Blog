import test from "node:test";
import assert from "node:assert/strict";
import { slugify, normalizeTags } from "../src/utils/slugify.js";

test("slugify creates a URL-friendly slug", () => {
  assert.equal(slugify("  Hello, World!  "), "hello-world");
});
test("slugify handles punctuation and empty strings", () => {
  assert.equal(slugify("React + Node.js"), "react-node-js");
  assert.equal(slugify("!!!"), "");
});
test("normalizeTags trims, lowercases, deduplicates and limits tags", () => {
  assert.deepEqual(normalizeTags([" Web ", "#WEB", "Security", "", "React"]), ["web", "security", "react"]);
});
