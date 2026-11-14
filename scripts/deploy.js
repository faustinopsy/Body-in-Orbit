import { execFileSync, execSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BRANCH = 'producao';
const WORKTREE = '.deploy';
const OUTPUT = 'dist';

const say = (message) => process.stdout.write(`${message}\n`);

function git(args, cwd = process.cwd()) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
}

function assertCleanTree() {
  if (git(['status', '--porcelain']) !== '') {
    throw new Error('There are uncommitted changes. Commit them before deploying.');
  }
}

function removeWorktree() {
  if (!existsSync(WORKTREE)) return;
  git(['worktree', 'remove', '--force', WORKTREE]);
}

function remoteHasBranch() {
  return git(['ls-remote', '--heads', 'origin', BRANCH]) !== '';
}

function createWorktree() {
  if (remoteHasBranch()) {
    git(['fetch', 'origin', BRANCH]);
    git(['worktree', 'add', '-B', BRANCH, WORKTREE, `origin/${BRANCH}`]);
    return;
  }
  git(['worktree', 'add', '--detach', WORKTREE]);
  git(['checkout', '--orphan', BRANCH], WORKTREE);
  git(['rm', '-rf', '--quiet', '.'], WORKTREE);
}

function replaceWorktreeContent() {
  readdirSync(WORKTREE)
    .filter((name) => name !== '.git')
    .forEach((name) => rmSync(join(WORKTREE, name), { recursive: true, force: true }));
  cpSync(OUTPUT, WORKTREE, { recursive: true });
  writeFileSync(join(WORKTREE, '.nojekyll'), '');
}

function publish(sourceCommit) {
  git(['add', '-A'], WORKTREE);
  if (git(['status', '--porcelain'], WORKTREE) === '') return say('Nothing new to publish.');
  git(['commit', '-m', `chore(deploy): publish build of ${sourceCommit}`], WORKTREE);
  git(['push', 'origin', BRANCH], WORKTREE);
  say(`Published to the ${BRANCH} branch.`);
}

function deploy() {
  assertCleanTree();
  const sourceCommit = git(['rev-parse', '--short', 'HEAD']);
  execSync('npm run check', { stdio: 'inherit' });
  removeWorktree();
  try {
    createWorktree();
    replaceWorktreeContent();
    publish(sourceCommit);
  } finally {
    removeWorktree();
  }
}

deploy();