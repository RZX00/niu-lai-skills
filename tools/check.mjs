#!/usr/bin/env node
// Repository checks that need no dependencies: run `node tools/check.mjs` from the repo root.
// Each check is a fact the README or an installer relies on.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

// 1. SKILL.md front matter, per the Agent Skills specification.
const skill = readFileSync(join(root, 'skills/niulai/SKILL.md'));
check(skill[0] !== 0xef, 'skills/niulai/SKILL.md starts with a byte order mark');
check(!skill.includes('\r\n'), 'skills/niulai/SKILL.md has CRLF line endings');
const front = /^---\n([\s\S]*?)\n---\n/.exec(skill.toString('utf8'));
check(front, 'skills/niulai/SKILL.md has no front matter block');
const field = (name) => new RegExp(`^${name}:[ \\t]*(.+)$`, 'm').exec(front?.[1] ?? '')?.[1]?.trim() ?? '';
check(field('name') === 'niulai', `SKILL.md name is "${field('name')}", expected the folder name "niulai"`);
check(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(field('name')), 'SKILL.md name must be lowercase letters, digits and hyphens');
const description = field('description');
check(description.length > 0 && description.length <= 1024, `SKILL.md description is ${description.length} characters (1 to 1024 allowed)`);

// 2. The promises the README and docs/install.md make about the skill are still in SKILL.md.
const body = skill.toString('utf8');
for (const promised of ['牛来！', '妈～～妈！！今天我们要构建什么', '妈妈']) {
  check(body.includes(promised), `SKILL.md no longer contains "${promised}", which README.md and docs/install.md promise`);
}
for (const word of ['hi', 'hello', '嗨', '你好', '牛来', 'niulai', '妈～妈']) {
  check(description.includes(word), `SKILL.md description lost the trigger word "${word}" that README.md lists`);
}

// 3. Plugin manifests parse and agree with each other.
const json = (path) => {
  try {
    return JSON.parse(read(path));
  } catch (error) {
    failures.push(`${path} is not valid JSON: ${error.message}`);
    return {};
  }
};
const plugin = json('.claude-plugin/plugin.json');
const marketplace = json('.claude-plugin/marketplace.json');
check(plugin.name === 'niulai', '.claude-plugin/plugin.json name must be "niulai" (README: /plugin install niulai@niu-lai-skills)');
check(marketplace.name === 'niu-lai-skills', '.claude-plugin/marketplace.json name must be "niu-lai-skills"');
check(marketplace.plugins?.some((item) => item.name === plugin.name), 'marketplace.json does not list the plugin from plugin.json');
check(plugin.version === marketplace.metadata?.version, 'plugin.json and marketplace.json versions differ');
check(existsSync(join(root, plugin.skills ?? '', 'niulai/SKILL.md')), 'plugin.json "skills" does not point at a folder containing niulai/SKILL.md');

// 4. The Codex pet bundle is complete.
const pet = json('pets/niulai/pet.json');
check(pet.id === 'niulai', 'pets/niulai/pet.json id must be "niulai"');
check(existsSync(join(root, 'pets/niulai', pet.spritesheetPath ?? '')), 'pets/niulai/pet.json points at a missing spritesheet');

// 5. Installers fetch files that exist in the repository.
for (const file of ['install.sh', 'install.ps1', 'pets/install.sh', 'pets/install.ps1']) {
  const text = read(file);
  check(!text.includes('\r\n') || file.endsWith('.ps1'), `${file} has CRLF line endings; curl | bash would fail`);
  for (const [, path] of text.matchAll(/raw\.githubusercontent\.com\/RZX00\/niu-lai-skills\/main\/([\w./-]+)/g)) {
    const isFile = existsSync(join(root, path)) && statSync(join(root, path)).isFile();
    const isBase = existsSync(join(root, path)) && statSync(join(root, path)).isDirectory();
    check(isFile || isBase, `${file} downloads ${path}, which is not in the repository`);
  }
}

// 6. Relative links and images in the Markdown files resolve.
const markdown = ['README.md', 'docs/install.md', ...readdirSync(join(root, 'docs/examples')).filter((name) => name.endsWith('.md')).map((name) => `docs/examples/${name}`)];
for (const file of markdown) {
  const text = read(file).replace(/```[\s\S]*?```/g, '');
  const targets = [...text.matchAll(/\]\(([^)\s]+)\)/g), ...text.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((match) => match[1]);
  for (const target of targets) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const path = join(root, dirname(file), decodeURIComponent(target.split('#')[0]));
    check(existsSync(path), `${file} links to ${target}, which does not exist`);
  }
}

if (failures.length) {
  for (const message of failures) console.error(`FAIL ${message}`);
  process.exit(1);
}
console.log('All repository checks passed.');
