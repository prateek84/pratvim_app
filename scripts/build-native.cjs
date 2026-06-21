const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "www");
const files = [
  "index.html",
  "app.js",
  "styles.css",
  "chat-wave-background.jpeg",
  "NunitoSans-Variable.ttf",
  "NunitoSans-OFL.txt",
  "icon-chevron-right-teal.svg",
  "icon-chevron-right.svg",
  "icon-clock-3.svg",
  "icon-message-circle.svg",
  "icon-pin.svg",
  "kid-maya-avatar.png",
  "kid-ravin-avatar.png",
  "parent-family-learning-sand-light.png",
  "parent-profile.svg",
  "parent-safety-setup-sand-light.png",
  "pratvim-icon-new.svg",
  "pratvim-logo-source.jpeg",
  "pratvim-wordmark.svg",
  "reference-wave-crest.png",
  "reference-wave-bottom.png",
  "splash-wave-background.jpeg",
  "splash-kid-cutout.png",
  "splash-kid-reference.png",
  "ravin.jpg",
  "team-prateek-sharma.jpeg",
  "team-ravindra-singh.jpg",
  "team-shashank-merothiya.jpg"
];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}

console.log(`Built ${files.length} web assets in ${output}`);
