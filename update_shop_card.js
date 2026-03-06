const fs = require('fs');

let fileContent = fs.readFileSync('app/shop/page.tsx', 'utf-8');

const newProductCard = `function ProductCard({ product }: { product: Product }) {
  // Validate Image Source to prevent Next.js Image component crashing on invalid URLs
  let imageUrl = null;
  
  // Try to get an image from either images array or imageUrl
  const imgSrc = (product.images && product.images.length > 0) ? product.images[0] : product.imageUrl;
  
  // Ensure it's a valid string that next/image accepts (starts with http or /)
  if (typeof imgSrc === 'string' && (imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('/'))) {
    imageUrl = imgSrc;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, type: "spring", stiffness: 80 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -10 }}
      className="glass oil-slick wet-shine group relative overflow-hidden rounded-2xl border border-white/50 shadow-[0_15px_45px_rgba(0,0,0,0.07)] transition-shadow duration-500 hover:shadow-[0_25px_65px_rgba(0,0,0,0.13)] sm:rounded-[1.6rem] bg-white/40 backdrop-blur-md"
    >
      {/* Image area */}
      <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name || "Product Image"}
            fill
            className="object-cover transition-transform duration-800 ease-out group-hover:scale-[1.07]"
            sizes="(max-width: 768px) 100vw, 33vw"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f3f4f6] text-gray-400">
            <span className="text-xl mb-2">📸</span>
            <span className="text-xs tracking-wider">NO IMAGE</span>
          </div>
        )}

        {/* Glossy shine sweep on hover */}
        <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-y-0 -left-[160%] w-[75%] bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-1200 ease-out group-hover:translate-x-[450%]" />
        </div>

        {/* Category tag */}
        <span className="absolute left-4 top-4 z-10 rounded-full border border-white/30 bg-white/40 px-3 py-1 text-[10px] tracking-[0.15em] font-medium text-[#2C2C2C] backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] uppercase">
          {product.category || "FURNITURE"}
        </span>
      </div>

      {/* Card body */}
      <div className="relative space-y-3 p-5 sm:p-6 bg-white/60">
        {/* Title and Price Flex Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif tracking-wide text-xl leading-tight text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <p className="font-medium text-[#D4AF37] text-lg shrink-0">
            \${typeof product.price === 'number' ? product.price.toFixed(2) : "0.00"}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-[#2C2C2C]/70 line-clamp-2">
          {product.description}
        </p>

        {/* Wet line separator */}
        <div className="wet-line w-full my-4" />

        {/* View details CTA */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 group/btn cursor-pointer">
            <span className="text-xs font-medium tracking-[0.18em] text-[#D4AF37] transition-colors group-hover/btn:text-[#C9A961]">
              ADD TO CART
            </span>
            <span className="inline-block text-[#D4AF37] transition-transform duration-300 group-hover/btn:translate-x-1">
              +
            </span>
          </div>
          
          <div className="text-[10px] tracking-widest text-gray-400">
            IN STOCK
          </div>
        </div>
      </div>
    </motion.article>
  );
}`;

const startIdx = fileContent.indexOf('function ProductCard({ product }: { product: Product }) {');
const endIdx = fileContent.indexOf('export default function ShopPage() {');

if (startIdx !== -1 && endIdx !== -1) {
  fileContent = fileContent.substring(0, startIdx) + newProductCard + '\n\n' + fileContent.substring(endIdx);
  fs.writeFileSync('app/shop/page.tsx', fileContent);
  console.log('Update successful');
} else {
  console.log('Could not find markers');
}
