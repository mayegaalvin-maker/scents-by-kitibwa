import { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, MapPin, Phone, Search, Sparkles } from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AdminPortal } from './components/admin/AdminPortal';
import { Navbar } from './components/layout/Navbar';
import { ProductCard } from './components/store/ProductCard';
import { PRODUCT_CATEGORIES, type ProductCategory, type StorePage } from './types';

const categoryArt = [
  { title: 'Perfumes', note: 'A scent for every side of you', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Skincare', note: 'Your everyday care ritual', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Cosmetics', note: 'Colour, care and confidence', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Beauty essentials', note: 'Little things, lovely details', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1000&q=85' },
] as const;

function AppContent() {
  const { products } = useStore();
  const [activePage, setActivePage] = useState<StorePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [search, setSearch] = useState('');

  const navigate = (page: StorePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleProducts = products.filter((product) => {
    const categoryMatches = selectedCategory === 'All' || product.category === selectedCategory;
    const searchMatches = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search.trim().toLowerCase());
    return categoryMatches && searchMatches;
  });

  return (
    <div className="site-frame">
      <Navbar activePage={activePage} navigate={navigate} />
      {activePage === 'admin' ? <AdminPortal backToStore={() => navigate('home')} /> : <>
        {activePage === 'home' && <HomePage products={products} navigate={navigate} setSelectedCategory={setSelectedCategory} />}
        {activePage === 'shop' && <ShopPage products={visibleProducts} search={search} setSearch={setSearch} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} navigate={navigate} />}
        {activePage === 'about' && <AboutPage navigate={navigate} />}
        {activePage === 'visit' && <VisitPage />}
      </>}
      <Footer navigate={navigate} />
    </div>
  );
}

function HomePage({ products, navigate, setSelectedCategory }: { products: ReturnType<typeof useStore>['products']; navigate: (page: StorePage) => void; setSelectedCategory: (category: ProductCategory | 'All') => void }) {
  return <main>
    <section className="hero-band">
      <div className="hero-image" role="img" aria-label="Perfume bottles in warm afternoon light" />
      <div className="hero-shade" />
      <div className="hero-content page-shell">
        <span className="eyebrow light-eyebrow">Fragrance · Beauty · Care</span>
        <h1>Find the little<br /><em>things you love.</em></h1>
        <p>Perfumes, cosmetics and skincare, gathered for you in the heart of Kampala.</p>
        <div className="hero-buttons"><button className="button button-light" onClick={() => navigate('shop')}>Explore the shop <ArrowRight size={16} /></button><a className="hero-text-link" href="https://wa.me/256752576561?text=Hello%20Scents%20By%20Kitiibwa%2C%20I%27d%20love%20some%20help%20finding%20a%20product." target="_blank" rel="noreferrer">Ask us what suits you <ArrowUpRight size={15} /></a></div>
      </div>
      <button className="hero-scroll" onClick={() => document.querySelector('#browse')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Scroll to browse categories"><ArrowDown size={16} /></button>
      <span className="hero-location">New Pioneer Mall · Kampala</span>
    </section>

    <section className="benefit-strip" aria-label="Shop information"><div><span>01</span><p><strong>Fragrance for every day</strong><small>Find a new favourite, your way</small></p></div><div><span>02</span><p><strong>Beauty all in one place</strong><small>Cosmetics and skincare essentials</small></p></div><div><span>03</span><p><strong>Delivery available</strong><small>Ask us about getting it to you</small></p></div></section>

    <section className="browse-section page-shell" id="browse">
      <div className="section-heading"><div><span className="eyebrow">A good place to begin</span><h2>Beauty, your way.</h2></div><p>Looking for something particular? Tell us what you love and we’ll help you find a good match.</p></div>
      <div className="category-grid">{categoryArt.map((category, index) => <button className={`category-tile category-tile-${index + 1}`} key={category.title} onClick={() => { setSelectedCategory(category.title); navigate('shop'); }}><img src={category.image} alt="" loading="lazy" /><span className="category-overlay" /><span className="category-copy"><small>{category.note}</small><strong>{category.title}</strong></span><ArrowUpRight className="category-arrow" size={18} /></button>)}</div>
    </section>

    <section className="arrival-band"><div className="page-shell"><div className="section-heading"><div><span className="eyebrow">Chosen by the shop</span><h2>New at the shop.</h2></div><button className="text-link" onClick={() => navigate('shop')}>Browse all products <ArrowRight size={15} /></button></div>{products.length ? <div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-store"><div className="empty-mark"><Sparkles size={20} /></div><h3>Fresh finds are on their way.</h3><p>Check back soon, or stop by our shop at New Pioneer Mall.</p><a href="https://wa.me/256752576561?text=Hello%2C%20what%20products%20are%20available%20at%20Scents%20By%20Kitiibwa%3F" target="_blank" rel="noreferrer">Ask us about what’s in store <ArrowUpRight size={14} /></a></div>}</div></section>

    <section className="story-band"><div className="story-image"><img src="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1300&q=85" alt="A fragrance and beauty display" loading="lazy" /></div><div className="story-copy"><span className="eyebrow">A warm welcome awaits</span><h2>Good finds.<br />Good feelings.</h2><p>Whether you know exactly what you want or you’re still exploring, come by and have a look. We bring fragrances, cosmetics and skincare together in one easy-to-find spot in central Kampala.</p><button className="button button-green" onClick={() => navigate('about')}>A little about our shop <ArrowRight size={15} /></button></div></section>

    <ContactBand />
  </main>;
}

function ShopPage({ products, search, setSearch, selectedCategory, setSelectedCategory, navigate }: { products: ReturnType<typeof useStore>['products']; search: string; setSearch: (search: string) => void; selectedCategory: ProductCategory | 'All'; setSelectedCategory: (category: ProductCategory | 'All') => void; navigate: (page: StorePage) => void }) {
  return <main className="shop-page page-shell"><div className="shop-intro"><span className="eyebrow">The shop · Kampala</span><h1>Find your next favourite.</h1><p>Browse fragrances, cosmetics and skincare selected at Scents By Kitiibwa.</p></div><div className="shop-controls"><label className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" /><span>{products.length} found</span></label><div className="category-filters" aria-label="Filter by category"><button className={selectedCategory === 'All' ? 'selected' : ''} onClick={() => setSelectedCategory('All')}>All</button>{PRODUCT_CATEGORIES.map((category) => <button key={category} className={selectedCategory === category ? 'selected' : ''} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div></div>{products.length ? <div className="product-grid shop-products">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="shop-empty"><Sparkles size={24} /><h2>{search ? 'No products match that search.' : 'No products in this collection yet.'}</h2><p>New arrivals are added by the shop. Ask us what’s available today.</p><div><a className="button button-green" href="https://wa.me/256752576561?text=Hello%2C%20what%20products%20do%20you%20currently%20have%20available%3F" target="_blank" rel="noreferrer">Ask on WhatsApp <ArrowUpRight size={15} /></a><button className="text-link" onClick={() => navigate('visit')}>Visit the shop <ArrowRight size={15} /></button></div></div>}</main>;
}

function AboutPage({ navigate }: { navigate: (page: StorePage) => void }) {
  return <main className="about-page"><section className="about-hero page-shell"><div><span className="eyebrow">Scents By Kitiibwa</span><h1>A neighbourhood stop for feeling like yourself.</h1><p>We bring together fragrances, cosmetics and skincare in the heart of Kampala, with a friendly hand when you need one.</p><button className="button button-green" onClick={() => navigate('visit')}>Find our shop <MapPin size={15} /></button></div><img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1300&q=85" alt="Fragrance bottles at a beauty shop" /></section><section className="about-note"><span className="eyebrow">Easy to find, easy to ask</span><h2>Come in curious.</h2><p>Browse at your own pace, ask us about a product, or send a message before you visit. We can also help arrange delivery.</p><a href="https://wa.me/256752576561" target="_blank" rel="noreferrer">Talk to the shop <ArrowUpRight size={15} /></a></section></main>;
}

function VisitPage() {
  return <main className="visit-page page-shell"><div className="visit-heading"><span className="eyebrow">Come say hello</span><h1>Find us in town.</h1><p>We’re inside New Pioneer Mall, on Burton Street in central Kampala.</p></div><div className="visit-grid"><section className="visit-details"><div><MapPin size={19} /><p><small>Visit</small><strong>New Pioneer Mall, Burton Street</strong><span>Kampala, Uganda</span></p></div><div><Phone size={19} /><p><small>Call or WhatsApp</small><a href="tel:+256752576561">+256 752 576561</a></p></div><div><Clock3 size={19} /><p><small>Opening hours</small><strong>Monday – Saturday</strong><span>7:30 am – 8:30 pm</span><strong>Sunday</strong><span>Closed</span></p></div><a className="button button-green" href="https://www.google.com/maps/search/?api=1&query=New+Pioneer+Mall%2C+Burton+Street%2C+Kampala" target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15} /></a></section><a className="visit-map" href="https://www.google.com/maps/search/?api=1&query=New+Pioneer+Mall%2C+Burton+Street%2C+Kampala" target="_blank" rel="noreferrer" aria-label="Open New Pioneer Mall directions in Google Maps"><img src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=82" alt="Map illustration" /><span>New Pioneer Mall <ArrowUpRight size={17} /></span></a></div></main>;
}

function ContactBand() {
  return <section className="contact-band"><div className="page-shell contact-band-inner"><div><span className="eyebrow light-eyebrow">A little help goes a long way</span><h2>Something caught your eye?</h2><p>Tell us what you’re looking for. We’ll be happy to help.</p></div><a className="button button-outline-light" href="https://wa.me/256752576561?text=Hello%20Scents%20By%20Kitiibwa%2C%20I%27d%20like%20to%20ask%20about%20your%20products." target="_blank" rel="noreferrer">Chat with us <ArrowUpRight size={15} /></a></div></section>;
}

function Footer({ navigate }: { navigate: (page: StorePage) => void }) {
  return <footer className="site-footer"><div className="page-shell footer-main"><button className="footer-brand" onClick={() => navigate('home')}>Scents By Kitiibwa<span>Fragrance · Beauty · Care</span></button><div className="footer-links"><div><strong>Explore</strong><button onClick={() => navigate('shop')}>Shop products</button><button onClick={() => navigate('about')}>Our shop</button><button onClick={() => navigate('visit')}>Hours & directions</button></div><div><strong>Get in touch</strong><a href="tel:+256752576561">+256 752 576561</a><a href="https://wa.me/256752576561" target="_blank" rel="noreferrer">WhatsApp the shop <ArrowUpRight size={12} /></a><span>New Pioneer Mall, Kampala</span></div></div></div><div className="page-shell footer-bottom"><span>© {new Date().getFullYear()} Scents By Kitiibwa</span><button onClick={() => navigate('admin')}>Owner portal</button></div></footer>;
}

export default function App() {
  return <StoreProvider><AppContent /></StoreProvider>;
}