const fs = require('fs');

let pagePath = 'app/shop/page.tsx';
if (fs.existsSync(pagePath)) {
  let text = fs.readFileSync(pagePath, 'utf8');

  const oldHeader = /<header className="mb-12 text-center flex flex-col items-center">[\s\S]*?<\/header>/;

  const searchHeader = `
        <header className="relative z-20 pt-8 pb-12 flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto">
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
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#D4AF37]">
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          </motion.div>
        </header>
  `;

  if (text.match(oldHeader)) {
     text = text.replace(oldHeader, searchHeader.trim());
     console.log("Replaced perfectly!");
  } else {
     console.log("no match header");
  }

  fs.writeFileSync(pagePath, text);
}
