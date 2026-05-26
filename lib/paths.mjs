import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = path.resolve(here, "..");
export const packsRoot = path.join(repoRoot, "skills");

export const commonPackName = "_common";
export const commonPackDir = path.join(packsRoot, commonPackName);

export function packDir(name) {
  return path.join(packsRoot, name);
}

export function relPackPath(packName, skillName) {
  return `skills/${packName}/${skillName}`;
}

export function targetSkillsDir(cwd = process.cwd()) {
  return path.join(cwd, ".claude", "skills");
}