import fs from "fs/promises";
import path from "path";
import chalk from "chalk";

// Import our validators
import {
  validateVersion,
  validateTrackName,
} from "../lib/validators/headerValidator.js";

import {
  validateOutport,
  validateInport,
} from "../lib/validators/portConfigValidator.js";

import { validateOutChannel } from "../lib/validators/channelValidator.js";
import { validateDrumLanes } from "../lib/validators/drumLaneValidator.js";
import { validateCCs } from "../lib/validators/ccValidator.js";
import { validateNRPNs } from "../lib/validators/nrpnValidator.js";

async function testDefinitionFile(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split("\n");

    const results = {
      version: validateVersion(lines),
      trackName: validateTrackName(lines),
      outport: validateOutport(lines),
      inport: validateInport(lines),
      outChannel: validateOutChannel(lines),
      drumLanes: validateDrumLanes(lines),
      ccs: validateCCs(lines),
      nrpns: validateNRPNs(lines),
    };

    return {
      file: path.basename(filePath),
      results,
      isValid: Object.values(results).every((r) => r.valid),
      errors: Object.entries(results)
        .filter(([_, r]) => !r.valid)
        .map(([section, r]) => ({ section, error: r.error })),
    };
  } catch (err) {
    return {
      file: path.basename(filePath),
      error: `Failed to process file: ${err.message}`,
      isValid: false,
    };
  }
}

async function runTests() {
  try {
    const definitionsDir = path.join(process.cwd(), "definitions");
    const files = await fs.readdir(definitionsDir);
    const definitionFiles = files.filter((f) => f.endsWith(".txt"));

    console.log(
      chalk.blue(`Found ${definitionFiles.length} definition files to test\n`)
    );

    let passCount = 0;
    let failCount = 0;

    for (const file of definitionFiles) {
      const filePath = path.join(definitionsDir, file);
      const result = await testDefinitionFile(filePath);

      if (result.isValid) {
        console.log(chalk.green(`✓ ${result.file} passed all checks`));
        passCount++;
      } else {
        console.log(chalk.red(`✗ ${result.file} failed validation:`));
        if (result.errors) {
          result.errors.forEach(({ section, error }) => {
            console.log(chalk.red(`  - ${section}: ${error}`));
          });
        } else if (result.error) {
          console.log(chalk.red(`  - ${result.error}`));
        }
        failCount++;
      }
      console.log(""); // Empty line between files
    }

    // Print summary
    console.log(chalk.blue("\nTest Summary:"));
    console.log(chalk.blue("============="));
    console.log(chalk.green(`Passed: ${passCount}`));
    console.log(chalk.red(`Failed: ${failCount}`));
    console.log(chalk.blue(`Total: ${passCount + failCount}`));
  } catch (err) {
    console.error(chalk.red("Failed to run tests:", err.message));
  }
}

runTests();
