import { Addon, Service, Readme } from "talkops";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

import languages from "./parameters/languages.json" with { type: "json" };

const addon = new Addon("Picovoice Porcupine");

addon.setDockerRepository("talkops/talkops-addon-picovoice-porcupine");

addon.setDescription(
  "This Addon based on [Picovoice Porcupine](https://picovoice.ai/platform/porcupine/) allows the agent to be activated by a custom keyword without requiring continuous listening. It runs efficiently on-device, ensuring privacy and low latency, making it ideal for hands-free voice interaction."
);

addon.setInstallationGuide(`
* Generate and download your keywords from the [Picovoice Console](https://console.picovoice.ai).
* Place the \`keywords\` directory inside the \`data\` volume.
`);

addon.setDockerVolumeData("keywords");

addon.setEnvironmentVariables({
  ACCESS_KEY: {
    description:
      "The access key provided by Picovoice. Sign up at [Picovoice Console](https://console.picovoice.ai/signup) to obtain your access key.",
  },
  LANGUAGE: {
    defaultValue: "English",
    description: "The language of keywords.",
    availableValues: Object.values(languages),
  },
  SENSITIVITY: {
    description:
      "The sensitivity between 0 and 1. A higher sensitivity reduces miss rate at cost of increased false alarm rate.",
    defaultValue: 0.7,
    validation: (v) => parseFloat(v) >= 0 && parseFloat(v) <= 1,
  },
});

const accessKey = process.env.ACCESS_KEY;
const sensitivity = parseFloat(process.env.SENSITIVITY);
function getLanguageCode(language) {
  for (let [name, value] of Object.entries(languages)) {
    if (value === language) {
      return name;
    }
  }
  return undefined;
}
const languageCode = getLanguageCode(process.env.LANGUAGE);

function updateKeywords() {
  addon.errors = [];
  const keywords = new Map();
  try {
    const fileNames = fs.readdirSync("/data");
    for (const fileName of fileNames) {
      if (fileName.startsWith(".")) {
        continue;
      }
      const filePath = path.join("/data", fileName);
      const fileExtension = path.extname(fileName);
      const fileNameWithoutExtension = path.basename(
        fileName,
        path.extname(fileName)
      );
      const fileNameSplitted = fileName.split("_");
      const fileKeyword = fileNameSplitted[0];
      const filelanguageCode = fileNameSplitted[1];
      if (filelanguageCode !== languageCode) {
        console.error(`Invalid language: ${fileName}`);
        continue;
      }
      const filePlatform = fileNameSplitted[2];
      if (filePlatform !== "wasm") {
        console.error(`Invalid platform: ${fileName}`);
        continue;
      }

      let content = null;
      if (fileExtension === ".zip") {
        try {
          const zip = new AdmZip(filePath);
          const entries = zip.getEntries();
          const ppnEntry = entries.find((entry) =>
            entry.entryName.endsWith(".ppn")
          );
          if (ppnEntry) {
            content = ppnEntry.getData();
          }
        } catch (err) {
          console.error(err);
        }
      } else if (fileExtension === ".ppn") {
        content = fs.readFileSync(filePath);
      } else {
        console.error(`Invalid extension: ${fileName}`);
        continue;
      }
      if (fileKeyword && content) {
        keywords.set(fileName, {
          label: fileKeyword,
          base64: content.toString("base64"),
          sensitivity,
          customWritePath: fileNameWithoutExtension,
        });
      }
    }
  } catch (err) {
    console.error(err);
  }

  if (keywords.size === 0) {
    addon.errors.push("At least one keyword must be added to the data volume.");
  }

  addon.setParameters({
    accessKey,
    languageCode,
    keywords: [...keywords.values()],
  });
}
if (addon.errors.length === 0) {
  updateKeywords();
  fs.watch("/data", updateKeywords);
}

new Readme(process.env.README_TEMPLATE_URL, "/app/README.md", addon);
new Service(process.env.AGENT_URLS.split(","), addon);
