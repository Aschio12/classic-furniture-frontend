const fs = require('fs');
let cssPath = 'app/globals.css';

if (fs.existsSync(cssPath)) {
  let text = fs.readFileSync(cssPath, 'utf8');

  const oldBody = /body \{[\s\S]*?@apply bg-background text-foreground;[\s\S]*?\}/;
  
  const newBody = `body {
    @apply text-foreground;
    background: linear-gradient(120deg, #FAFAFA, #FDFDFB, #F9F6EA, #F4E8D1, #FAFAFA);
    background-size: 300% 300%;
    animation: watery-bg 15s ease-in-out infinite;
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    min-height: 100vh;
    line-height: inherit;
  }`;

  text = text.replace(oldBody, newBody);

  const keyframes = `
@keyframes watery-bg {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
  `;

  if (!text.includes('watery-bg')) {
    text += '\\n' + keyframes;
  }

  fs.writeFileSync(cssPath, text);
  console.log("Patched body bg");
}
