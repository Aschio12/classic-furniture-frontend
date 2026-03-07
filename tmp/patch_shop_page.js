const fs = require('fs');

let pagePath = 'app/shop/page.tsx';
if (fs.existsSync(pagePath)) {
  let text = fs.readFileSync(pagePath, 'utf8');
  
  // 1. Add states
  if (!text.includes('const [searchQuery')) {
    text = text.replace(/const \[loading, setLoading\] = useState\(true\);/, `const [loading, setLoading] = useState(true);\n  const [searchQuery, setSearchQuery] = useState("");\n  const [priceFilter, setPriceFilter] = useState("all");`);
  }

  // 2. Add lucide import for Search
  if (!text.includes('Search')) {
    text = text.replace(/import \{ ShoppingCart \} from "lucide-react";/, 'import { ShoppingCart, Search, SlidersHorizontal } from "lucide-react";');
  }

  // 3. Computed filteredProducts
  if (!text.includes('const filteredProducts =')) {
    const filterLogic = `
  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (priceFilter === "low") return a.price - b.price;
      if (priceFilter === "high") return b.price - a.price;
      return 0;
    });

  useEffect(() => {
`;
    text = text.replace(/useEffect\(\(\) => \{/, filterLogic);
  }

  // 4. Map over filteredProducts
  text = text.replace(/products\.map\(\(product, index\)/, "filteredProducts.map((product, index)");

  // 5. Replace header text with search/filter UI
  const headerRegex = /<header className="relative z-20 pt-32 pb-8 flex flex-col items-center justify-center text-center">[\s\S]*?<\/header>/;
  
  const searchHeader = `
        <header className="relative z-20 pt-32 pb-12 flex flex-col items-center justify-center text-center w-full max-w-5xl mx-auto z-40">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex flex-col sm:flex-row gap-4 px-4 relative z-40"
          >
            {/* Search Input */}
            <div className="relative w-full flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#D4AF37] group-focus-within:text-[#B8860B] transition-colors">
                <Search size={18} strokeWidth={2.5} />
              </div>
              <input 
                type="text"
                placeholder="SEARCH COLLECTION..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/70 backdrop-blur-2xl border border-white/50 border-b-[#D4AF37]/30 border-r-[#D4AF37]/30 text-gray-900 placeholder:text-gray-400 placeholder:tracking-widest focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus:shadow-[0_8px_30px_rgba(212,175,55,0.15)] transition-all text-sm tracking-[0.1em] font-semibold"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative min-w-[240px] group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#D4AF37] group-focus-within:text-[#B8860B] transition-colors">
                <SlidersHorizontal size={18} strokeWidth={2.5} />
              </div>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full pl-14 pr-10 py-4 rounded-2xl bg-white/70 backdrop-blur-2xl border border-white/50 border-b-[#D4AF37]/30 border-r-[#D4AF37]/30 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus:shadow-[0_8px_30px_rgba(212,175,55,0.15)] transition-all text-[11px] tracking-widest font-bold appearance-none cursor-pointer"
              >
                <option value="all">ALL PRICES</option>
                <option value="low">PRICE: LOW - HIGH</option>
                <option value="high">PRICE: HIGH - LOW</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-[#D4AF37]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </motion.div>
        </header>
  `;

  if (text.match(headerRegex)) {
     text = text.replace(headerRegex, searchHeader);
  } else {
     console.log("no match header");
  }

  fs.writeFileSync(pagePath, text);
}

console.log("Patched Shop Page");
