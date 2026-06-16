import { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Zap, Server, HelpCircle, Globe, TrendingUp, Search, 
  ArrowLeft, Folder, X, Package, Grid, Shield
} from 'lucide-react';
import { articles, categories, Article } from './data/content';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';

// --- Type definitions ---
interface SidebarProps {
  search: string;
  setSearch: (val: string) => void;
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
}

interface HomePageProps {
  search: string;
  setSearch: (val: string) => void;
  activeCategory: string | null;
  setActiveCategory: (cat: string | null) => void;
}

// --- Component Helper Maps ---
const catIcons: Record<string, React.ComponentType<any>> = {
  lightning: Zap,
  nodes: Server,
  'help-desk': HelpCircle,
  global: Globe,
  market: TrendingUp
};

const borderColors: Record<string, string> = {
  lightning: "border-t-yellow-400",
  nodes: "border-t-blue-400",
  'help-desk': "border-t-purple-400",
  global: "border-t-green-400",
  market: "border-t-orange-400"
};

// --- Animations ---
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

// --- Layout Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MobileNav = () => (
  <nav className="flex lg:hidden bg-surface border-b border-border px-4 py-3.5 items-center justify-between sticky top-0 z-30 h-14">
    <Link to="/" className="flex items-center gap-2.5">
      <div className="border border-brand/40 p-1.5 rounded-lg text-brand">
        <Zap className="w-3.5 h-3.5 fill-brand" />
      </div>
      <span className="font-mono font-bold text-xs tracking-widest text-text-primary">ARCHIVE</span>
    </Link>
    
    <div className="flex items-center gap-3">
      <a 
        href="https://needcreations.github.io/Frontier_Forge/" 
        className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary hover:text-brand flex items-center gap-1 transition-colors"
      >
        <ArrowLeft className="w-3 h-3" /> Forge
      </a>
      <img 
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
        alt="Profile" 
        className="w-6 h-6 rounded-full border border-border"
      />
    </div>
  </nav>
);

const Sidebar = ({ search, setSearch, activeCategory, setActiveCategory }: SidebarProps) => {
  const [showPro, setShowPro] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <aside className="hidden lg:flex w-[260px] h-screen bg-surface border-r border-border fixed top-0 left-0 flex-col p-6 z-40 justify-between">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-border pb-5 h-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="border border-brand/40 p-1.5 rounded-lg text-brand">
              <Zap className="w-4 h-4 fill-brand" />
            </div>
            <span className="font-mono font-bold text-sm tracking-widest text-text-primary">ARCHIVE</span>
          </Link>
          
          {/* Avatar Profile */}
          <div className="relative group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="Profile" 
              className="w-7 h-7 rounded-full border border-border group-hover:border-brand transition-colors duration-200"
            />
            <div className="absolute right-0 top-8 bg-surface border border-border text-[9px] font-mono text-text-secondary px-2 py-1 rounded-md hidden group-hover:block whitespace-nowrap shadow-lg z-50">
              View Profile
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        {isHome ? (
          <div className="flex flex-col gap-6">
            {/* Search slot */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search catalog..."
                className="w-full bg-[#1c1c21] border border-border rounded-lg py-2 pl-10 pr-4 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/40 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Navigation links */}
            <nav className="flex flex-col gap-1.5">
              <button 
                onClick={() => setActiveCategory(null)}
                className={classNames(
                  "w-full px-3 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase text-left flex items-center gap-3 transition-all duration-200 border border-transparent",
                  !activeCategory ? "bg-surface-active text-text-primary border-border" : "text-text-secondary hover:bg-white/[0.02] hover:text-text-primary"
                )}
              >
                <Grid className="w-4 h-4 shrink-0" />
                <span>All Archives</span>
              </button>
              {categories.map(cat => {
                const Icon = catIcons[cat.id];
                const isActive = activeCategory === cat.id;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={classNames(
                      "w-full px-3 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase text-left flex items-center gap-3 transition-all duration-200 border border-transparent",
                      isActive ? "bg-surface-active text-text-primary border-border" : "text-text-secondary hover:bg-white/[0.02] hover:text-text-primary"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        ) : (
          /* Sub-route details navigation */
          <Link 
            to="/" 
            className="flex items-center gap-2.5 text-xs font-mono font-bold tracking-wider uppercase text-text-secondary hover:text-brand transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Library Index</span>
          </Link>
        )}
      </div>

      {/* Pro Card at Bottom */}
      {showPro && (
        <div className="bg-[#1c1c21] border border-border p-4 rounded-xl relative shadow-md">
          <button 
            onClick={() => setShowPro(false)}
            className="absolute top-3 right-3 text-text-muted hover:text-text-secondary transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          
          <div className="bg-brand/10 p-2 rounded-lg border border-brand/20 w-fit mb-3">
            <Package className="w-4 h-4 text-brand" />
          </div>
          
          <h4 className="text-text-primary text-xs font-bold mb-1">Upgrade to Pro!</h4>
          <p className="text-text-secondary text-[10px] leading-normal mb-3">Unlock Premium Features and Manage Unlimited projects</p>
          <button className="w-full bg-surface-active hover:bg-[#2e2e34] text-text-primary text-[11px] font-bold py-2 rounded-lg transition-colors border border-border">
            Upgrade Now
          </button>
        </div>
      )}
    </aside>
  );
};

const LibraryHeader = ({ activeCategory }: { activeCategory: string | null }) => {
  const cat = categories.find(c => c.id === activeCategory);
  return (
    <div className="hidden lg:block mb-8 border-b border-border pb-5">
      <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1.5">
        Library / {cat ? cat.name : "All Archives"}
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-text-primary text-2xl font-mono font-bold flex items-center gap-2.5">
          <Folder className="w-5 h-5 text-brand shrink-0" />
          {cat ? cat.name : "Bitcoin Education Archive"}
        </h2>
        <div className="text-[10px] text-text-secondary border border-border bg-surface px-3 py-1.5 rounded-lg font-mono">
          Active Archive • 2026
        </div>
      </div>
    </div>
  );
};

const ArticleCard = ({ article }: { article: Article }) => {
  const Icon = catIcons[article.category];

  return (
    <Link to={`/article/${article.id}`} className="block group h-full">
      <div className={classNames(
        "bg-surface border border-border group-hover:border-brand/40 rounded-xl p-5 transition-all duration-300 relative overflow-hidden flex flex-col h-full border-t-[3px]",
        borderColors[article.category]
      )}>
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 rounded-lg bg-background border border-border text-text-primary">
            <Icon size={16} />
          </div>
          <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider font-mono">{article.date}</span>
        </div>
        
        <h3 className="text-base font-mono font-bold text-text-primary mb-2 group-hover:text-brand-light transition-colors line-clamp-1">{article.title}</h3>
        <p className="text-xs text-text-secondary leading-relaxed mb-5 line-clamp-2">{article.summary}</p>
        
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {article.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[9px] uppercase font-semibold font-mono bg-background px-2.5 py-1 rounded border border-border text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

const HomePage = ({ search, setSearch, activeCategory, setActiveCategory }: HomePageProps) => {
  const filteredArticles = useMemo(() => 
    articles.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                          a.summary.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory ? a.category === activeCategory : true;
      return matchesSearch && matchesCat;
    }), [search, activeCategory]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Mobile Header block / Desktop Hero */}
        <div className="mb-10 lg:mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-brand/5 border border-brand/20 px-3 py-1 rounded-md mb-4">
            <Shield className="w-3.5 h-3.5 text-brand" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-brand">Restored Backup • 2026 Archive</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-mono font-bold mb-3 tracking-tight text-text-primary uppercase leading-tight">
            bitcoin <span className="text-brand">education</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            The curated collection of analogies, guides, and technical insights from the global Bitcoin Education community.
          </p>

          {/* Search (Mobile Only) */}
          <div className="relative mt-6 lg:hidden">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search catalog..."
              className="w-full bg-[#1c1c21] border border-border rounded-lg py-2.5 pl-10 pr-4 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/40 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filters (Mobile Only) */}
        <div className="flex lg:hidden gap-1.5 overflow-x-auto pb-3 mb-6 -mx-4 px-4 scrollbar-none">
          <button 
            onClick={() => setActiveCategory(null)}
            className={classNames(
              "px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase whitespace-nowrap transition-colors border",
              !activeCategory ? "bg-brand border-brand text-text-primary" : "bg-surface border-border text-text-secondary"
            )}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={classNames(
                "px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase whitespace-nowrap transition-colors border",
                activeCategory === cat.id ? "bg-brand border-brand text-text-primary" : "bg-surface border-border text-text-secondary"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid Header (Desktop Only) */}
        <LibraryHeader activeCategory={activeCategory} />

        {/* Article Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface/20 rounded-xl border border-dashed border-border">
            <p className="text-text-muted font-mono text-xs">No results found for your search.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

const ArticlePage = () => {
  const { id } = useParams();
  const article = articles.find(a => a.id === id);
  const navigate = useNavigate();

  if (!article) return <div className="p-16 text-center font-mono text-text-muted text-xs">Article not recovered.</div>;

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-text-secondary hover:text-brand transition-colors text-[10px] font-mono font-bold uppercase tracking-wider border border-border bg-surface px-3 py-1.5 rounded-lg mb-10 w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Library</span>
        </button>

        <div className="mb-10">
          <div className="inline-block px-2.5 py-1 bg-brand/5 border border-brand/15 rounded-md text-[9px] font-bold font-mono text-brand uppercase tracking-wider mb-4">
            {categories.find(c => c.id === article.category)?.name}
          </div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold mb-4 leading-tight text-text-primary uppercase tracking-tight">{article.title}</h1>
          <div className="flex items-center gap-2 text-text-muted text-[10px] font-mono uppercase tracking-wider">
             <span>Source:</span>
             <span className="text-text-secondary font-semibold">{article.date}</span>
          </div>
        </div>

        <div 
          className="prose prose-invert max-w-none 
            [&>h2]:text-xl [&>h2]:font-mono [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-text-primary [&>h2]:tracking-tight
            [&>h3]:text-base [&>h3]:font-mono [&>h3]:font-bold [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-brand-light
            [&>p]:text-text-body [&>p]:leading-relaxed [&>p]:mb-6 text-sm md:text-base"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
        
        <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
          <div className="text-[10px] font-mono font-semibold text-text-muted uppercase tracking-widest">End of Entry</div>
          <button onClick={() => navigate('/')} className="text-brand hover:text-brand-light transition-colors text-xs font-mono font-bold uppercase tracking-widest">Next Topic</button>
        </div>
      </div>
    </PageWrapper>
  );
};

const Footer = () => (
  <footer className="border-t border-border py-8 px-4 mt-auto bg-surface relative z-10">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-secondary">
        Bitcoin Education Archive
      </div>
      <div className="text-text-muted text-[10px] font-mono">
        Part of the Frontier Forge Academy Knowledge Graph
      </div>
    </div>
  </footer>
);

// --- App Root ---
function App() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-text-body font-sans selection:bg-brand/30 selection:text-text-primary flex flex-col">
        {/* Decorative Grid BG */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] opacity-20 pointer-events-none" />
        
        {/* Sidebar Navigation (Desktop Only) */}
        <Sidebar 
          search={search} 
          setSearch={setSearch} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
          <MobileNav />
          <main className="flex-1 relative z-10">
            <AnimatePresence mode="wait">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <HomePage 
                      search={search} 
                      setSearch={setSearch} 
                      activeCategory={activeCategory} 
                      setActiveCategory={setActiveCategory} 
                    />
                  } 
                />
                <Route path="/article/:id" element={<ArticlePage />} />
              </Routes>
            </AnimatePresence>
          </main>
          
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
