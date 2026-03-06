const fs = require('fs');
const path = './app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const sIdx = content.indexOf('<AnimatePresence mode="wait">');
const blockStr = `{isAuthenticated ? (`;
const mainLayoutStart = content.indexOf('<MainLayout>', sIdx);
const eIdx = content.indexOf(') : (', mainLayoutStart);

if (mainLayoutStart !== -1 && eIdx !== -1) {
  const replacement = '{/* Render Landing Page Regardless of Auth Status */}\n';
  const before = content.substring(0, sIdx + '<AnimatePresence mode="wait">'.length);
  const after = content.substring(eIdx + ') : ('.length); // Skip over the `) : (`
  
  // also need to remove the trailing `)}` that matched the `isAuthenticated ? ( ... ) : (...)`
  const lastAnimateClose = after.lastIndexOf('</AnimatePresence>');
  const lastClosing = after.lastIndexOf(')}', lastAnimateClose);
  
  const finalAfter = after.substring(0, lastClosing) + after.substring(lastClosing + 2);
  
  content = before + '\n' + replacement + finalAfter;
  fs.writeFileSync(path, content);
  console.log('Successfully stripped MainLayout and dashboard leak from Landing Page');
} else {
  console.log("Could not find blocks");
}

