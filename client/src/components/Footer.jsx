import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link className="brand-mark footer-brand" to="/"><span className="brand-icon">W</span>write<span>sphere</span></Link>
        <p>A little more meaning in every scroll.</p>
        <span>© {new Date().getFullYear()} WriteSphere</span>
      </div>
    </footer>
  );
}
