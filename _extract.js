// Extract mascot entries with image slugs
const fs = require("fs");
const src = fs.readFileSync("C:/Users/andre/hat-trick/mascots.js", "utf8");

// Match each object literal that has an image: IMG("...") field
const entries = [];
const re = /\{[^{}]*image:\s*IMG\(["']([^"']+)["']\)[^{}]*\}/g;
let m;
while ((m = re.exec(src)) !== null) {
  const block = m[0];
  const slug = m[1];
  const name = (block.match(/name:\s*["']([^"']+)["']/) || [])[1] || "";
  const team = (block.match(/team:\s*["']([^"']+)["']/) || [])[1] || "";
  const city = (block.match(/city:\s*["']([^"']+)["']/) || [])[1] || "";
  const animal = (block.match(/animal:\s*["']([^"']+)["']/) || [])[1] || "";
  entries.push({ slug, name, team, city, animal });
}
console.log("Total:", entries.length);
fs.writeFileSync(
  "C:/Users/andre/hat-trick/_entries.json",
  JSON.stringify(entries, null, 2),
);
