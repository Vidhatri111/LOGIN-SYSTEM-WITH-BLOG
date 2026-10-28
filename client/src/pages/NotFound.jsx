import { Link } from "react-router-dom";

export default function NotFound() {
  return <div className="container not-found"><span className="not-found-mark">404</span><span className="section-kicker">THIS PAGE WANDERED OFF</span><h1>Let's get you<br />back to a good story.</h1><Link to="/" className="btn btn-gradient">Back to home <i className="bi bi-arrow-right" /></Link></div>;
}
