const fs = require('fs');
let navPath = 'components/shared/MainNavbar.tsx';

if (fs.existsSync(navPath)) {
  let text = fs.readFileSync(navPath, 'utf8');

  // Regex to find the <motion.div> of the dropdown and fix its width
  // Currently: className="absolute top-full left-0 right-0 mt-2 p-4 rounded-3xl z-40 lg:hidden"
  text = text.replace(
    /className="absolute top-full left-0 right-0 mt-2 p-4 rounded-3xl z-40 lg:hidden"/,
    'className="absolute top-[120%] right-6 mx-auto w-[200px] p-3 rounded-3xl z-40 lg:hidden"'
  );
  
  // also shrink the text padding inside
  text = text.replace(/px-6 py-3 rounded-2xl text-center/g, 'px-4 py-2.5 rounded-[1.25rem] text-center');

  fs.writeFileSync(navPath, text);
  console.log("Patched Mobile Dropdown");
}
