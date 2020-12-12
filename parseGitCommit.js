const fs = require('fs');
const childProcess = require('child_process');

const executeCommand = (command) => {
  return childProcess.execSync(command, { encoding: 'utf8' });
};

const getCommitHash = () => {
  const result = executeCommand('git reflog --decorate -1');

  // Do not show the commit hash if that commit is also a tag
  const tag = result.match(/tag:\s[a-zA-Z0-9\-.]+,/g);
  if (tag && tag.length > 0) {
    return '';
  } else {
    const match = result.match(/[a-z0-9]+\s\(HEAD/g);

    if (match) {
      return match[0].slice(0, -6);
    } else {
      return '';
    }
  }
};

const isDirty = () => {
  const result = executeCommand('git status --short');
  const lines = result.split("\n");
  
  // we want to ignore changes if they only affect npm-shrinkwrap.json as these
  // may happen unintentionally when using npm to install xud
  return lines.length > 2 || (lines.length === 2 && lines[0] !== ' M npm-shrinkwrap.json');  
};

const versionFilePath = `${__dirname}/lib/Version.ts`;

try {
  fs.unlinkSync(versionFilePath);
} catch (error) {}

const commitHash = getCommitHash();

fs.writeFileSync(versionFilePath, `export default '${commitHash === '' ? '' : '-' + commitHash}${isDirty() ? '-dirty' : ''}';\n`);
