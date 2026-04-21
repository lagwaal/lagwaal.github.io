import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>LAGWAL</h3>
          <p>Premium handcrafted gloves for every occasion. Quality materials, timeless design, unmatched comfort.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?cat=Leather">Leather Gloves</Link></li>
            <li><Link to="/products?cat=Winter">Winter Gloves</Link></li>
            <li><Link to="/products?cat=Sport">Sport Gloves</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Returns</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">Care Instructions</a></li>
            <li><Link to="/admin">Admin Panel</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Lagwal. All rights reserved.</p>
      </div>
    </footer>
  );
}
