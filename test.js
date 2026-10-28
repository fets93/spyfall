// Run with: node test.js
const assert = require("node:assert/strict");
const G = require("./game-logic.js");

const spiesIn = cards => cards.filter(c => c === G.SPY).length;

for (let players = 3; players <= 10; players++) {
  for (let spies = 1; spies < players; spies++) {
    const cards = G.dealCards(["Beach", "Casino"], spies, players);
    assert.equal(cards.length, players);
    assert.equal(spiesIn(cards), spies);
    assert.equal(new Set(cards.filter(c => c !== G.SPY)).size, 1, "all non-spies share one place");
  }
}

assert.equal(spiesIn(G.dealCards(["Beach"], 99, 4)), 3, "too many spies is clamped");
assert.deepEqual(G.dealCards(["Beach"], 1, 0), []);
assert.ok(G.dealCards([], 1, 3).includes("No place"));
for (let i = 0; i < 200; i++) assert.equal(spiesIn(G.dealCards(["Spy", "Beach"], 1, 3)), 1, "place named Spy is never dealt");
assert.ok(!G.DEFAULT_PLACES.includes(G.SPY));

// The spy should land on every seat about equally often
const hits = [0, 0, 0, 0, 0];
for (let i = 0; i < 5000; i++) hits[G.dealCards(["A"], 1, 5).indexOf(G.SPY)]++;
assert.ok(hits.every(h => h > 800), `spy seat distribution ${hits}`);

assert.equal(G.validatedNewEntry("  Anna ", []), "Anna");
assert.equal(G.validatedNewEntry("   ", []), null);
assert.equal(G.validatedNewEntry("anna", ["Anna"]), null);

assert.equal(G.formattedTime(480), "8:00");
assert.equal(G.formattedTime(59.2), "1:00");
assert.equal(G.formattedTime(9), "0:09");
assert.equal(G.formattedTime(0.1), "0:01");
assert.equal(G.formattedTime(0), "0:00");
assert.equal(G.formattedTime(-3), "0:00");

assert.equal(G.clampSpies(0, 5), 1);
assert.equal(G.clampSpies(9, 5), 4);
assert.equal(G.clampSpies(2, 2), 1);

console.log(`All tests passed (spy seat distribution: ${hits})`);
