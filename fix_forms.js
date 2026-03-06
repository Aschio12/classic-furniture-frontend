const fs = require('fs');

const loginPath = 'components/auth/LoginForm.tsx';
const registerPath = 'components/auth/RegisterForm.tsx';

function processForm(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the old class and replace it
  // old class: className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 group-focus-within:border-[#D4AF37]/40 group-focus-within:shadow-[0_8px_30px_rgba(212,175,55,0.08)]"
  
  // They might have variations, so let's do a regex replace
  const re = /className="relative overflow-hidden rounded-2xl bg-white\/80[^"]+"/g;
  const newClass = 'className="relative overflow-hidden rounded-none border border-white/80 bg-transparent transition-all duration-300 focus-within:border-white focus-within:shadow-[0_0_10px_rgba(255,255,255,0.5)]"';

  content = content.replace(re, newClass);
  // Ensure the inputs have transparent background
  content = content.replace(/bg-transparent/g, 'bg-transparent');
  
  // also make text refine Serif "Ensure all text is in a refined Serif font"
  // Let's wrap the form or the whole component with font-serif
  // Actually, we can just replace 'font-[Cormorant_Garamond]' with 'font-serif' or leave it as is if it's already serif.
  // We'll add font-serif to the inputs
  content = content.replace(/className="peer block w-full bg-transparent /g, 'className="peer block w-full bg-transparent font-serif ');

  fs.writeFileSync(filePath, content);
}

processForm(loginPath);
processForm(registerPath);
console.log("Forms updated");
