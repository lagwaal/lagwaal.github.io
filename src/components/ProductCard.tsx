import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/storage';
import { Product } from '../types';
import { Star } from 'lucide-react';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-img">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : null}
        🧤
        {discount > 0 && <span className="product-card-sale">-{discount}%</span>}
      </div>
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-rating">
          <span className="stars">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={12} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
            ))}
          </span>
          <span>{product.rating} ({product.reviews})</span>
        </div>
        <div className="product-card-price">
          <span className="current">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="original">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
