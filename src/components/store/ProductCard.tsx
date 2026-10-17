import { ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import type { Product } from '../../types';

function formatPrice(price: number, currency: Product['currency']) {
  return new Intl.NumberFormat(currency === 'UGX' ? 'en-UG' : 'en-US', {
    style: 'currency', currency, maximumFractionDigits: currency === 'UGX' ? 0 : 2,
  }).format(price);
}

export function ProductCard({ product }: { product: Product }) {
  const message = `Hello, I'm interested in ${product.name} (${formatPrice(product.price, product.currency)}). Is it available?`;

  return (
    <article className="product-card">
      <div className="product-photo">
        {product.images[0] ? <img src={product.images[0]} alt={product.name} loading="lazy" /> : <div className="photo-placeholder"><ImageIcon size={30} strokeWidth={1} /></div>}
        {product.images.length > 1 && <span className="photo-count">+{product.images.length - 1} photos</span>}
      </div>
      <div className="product-content">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        {product.description && <p>{product.description}</p>}
        <div className="product-card-footer">
          <strong>{formatPrice(product.price, product.currency)}</strong>
          <a href={`https://wa.me/256752576561?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" aria-label={`Ask about ${product.name} on WhatsApp`}>Ask about it <ArrowUpRight size={14} /></a>
        </div>
      </div>
    </article>
  );
}