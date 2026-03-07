const fs = require('fs');

const path = 'app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const navStart = content.indexOf('<nav');
const navEndTag = '</nav>';
const navEnd = content.indexOf(navEndTag, navStart) + navEndTag.length;

if (navStart === -1 || navEnd === -1) {
    console.error("Could not find <nav> block");
    process.exit(1);
}

const replacement = `<motion.nav
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-x-0 top-6 z-50 flex justify-center px-4 md:px-8 pointer-events-none"
            >
              <div
                className="pointer-events-auto relative flex w-full max-w-5xl items-center justify-between rounded-full px-6 py-3.5 sm:px-8 sm:py-4 transition-all duration-700 ease-out"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(25px) saturate(2)",
                  WebkitBackdropFilter: "blur(25px) saturate(2)",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.15)"
                }}
              >
                {/* Shine Sweep for the Oily/Glassy effect across the entire navbar */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-full pointer-events-none">
                  <div 
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" 
                    style={{ animation: "navbar-shine 8s infinite ease-in-out" }}
                  />
                </div>

                {/* Brand Logo - Metallic Silver/Chrome Text */}
                <Link href="/" className="relative z-10 group flex items-center gap-3">
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e0e0e0_0%,#ffffff_50%,#e0e0e0_100%)] shadow-[0_4px_14px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:shadow-[0_6px_22px_rgba(255,255,255,0.5)]">
                    <span className="font-serif tracking-wide text-lg font-bold text-gray-900">CF</span>
                  </div>
                  <div className="hidden flex-col sm:flex">
                    <span 
                      className="font-serif tracking-widest text-lg sm:text-xl font-bold bg-clip-text text-transparent drop-shadow-sm"
                      style={{
                        backgroundImage: "linear-gradient(to right, #8a8a8a, #ffffff, #8a8a8a)",
                        backgroundSize: "200% auto",
                        animation: "shine 4s linear infinite"
                      }}
                    >
                      CLASSIC FURNITURE
                    </span>
                  </div>
                </Link>

                {/* Center nav links — desktop only */}
                <div className="hidden items-center gap-2 lg:flex relative z-10">
                  {["Collections", "Craftsmanship", "Stories"].map((item) => (
                    <motion.div key={item} whileHover="hover" initial="initial">
                      <button
                        className="relative px-4 py-2.5 flex items-center justify-center"
                        onClick={() => {
                          const sectionMap = {
                            Collections: "featured",
                            Craftsmanship: "why-us",
                            Stories: "testimonials",
                          };
                          document
                            .getElementById(sectionMap[item])
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        {/* Soft Glow Liquid Blob Hover Effect via Framer Motion */}
                        <motion.div
                          variants={{
                            initial: { opacity: 0, scale: 0.8, filter: "blur(4px)" },
                            hover: { opacity: 1, scale: 1.1, filter: "blur(12px)" }
                          }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="absolute inset-0 rounded-full bg-white/20 pointer-events-none"
                        />
                        
                        <span className="relative z-10 text-[11px] tracking-[0.25em] font-medium text-white/80 transition-colors duration-300 hover:text-white">
                          {item.toUpperCase()}
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Auth Actions */}
                <div className="flex items-center gap-3 relative z-10">
                  <button 
                    onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                    className="relative px-4 py-2 text-[10px] tracking-[0.2em] text-white/80 transition-all duration-300 hover:text-white"
                  >
                    LOGIN
                  </button>

                  <button 
                    onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
                    className="group relative overflow-hidden rounded-full bg-[linear-gradient(to_right,#e0e0e0,#ffffff)] px-5 py-2 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-gray-900 shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] hover:scale-105"
                  >
                    <span className="relative z-10">SIGN UP</span>
                  </button>

                  <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
                    <DialogContent className="w-full border-0 bg-transparent p-0 shadow-none sm:max-w-md pointer-events-auto">
                      <motion.div 
                        initial={{ opacity: 0, y: 100, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        transition={{ type: "spring", stiffness: 60, damping: 15 }}
                      >
                        <VisuallyHidden>
                          <DialogTitle>{authMode === 'login' ? 'Login' : 'Register'}</DialogTitle>
                        </VisuallyHidden>
                        <div className="glass-oily backdrop-blur-[12px] saturate-[1.8] oil-slick-animated relative overflow-hidden rounded-2xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)] min-h-[460px]">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={authMode}
                              initial={{ opacity: 0, x: authMode === 'login' ? -20 : 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: authMode === 'login' ? 20 : -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              {authMode === 'login' ? (
                                <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
                              ) : (
                                <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <style dangerouslySetInnerHTML={{__html: \`
                @keyframes navbar-shine {
                  0%, 75% { transform: translateX(-250%) skewX(12deg); opacity: 0; }
                  80% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { transform: translateX(350%) skewX(12deg); opacity: 0; }
                }
                @keyframes shine {
                  to {
                    background-position: 200% center;
                  }
                }
              \`}} />
            </motion.nav>`;

const newContent = content.slice(0, navStart) + replacement + content.slice(navEnd);
fs.writeFileSync(path, newContent, 'utf8');
console.log("Successfully replaced the <nav> block.");
