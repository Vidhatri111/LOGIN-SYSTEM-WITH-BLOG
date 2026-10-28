import { Link } from "react-router-dom";

export default function About() {
  return <section className="container about-page">
    <div className="about-hero"><span className="section-kicker">A SMALLER, MORE HUMAN INTERNET</span><h1>Ideas are better<br />when <span>we share them.</span></h1><p>WriteSphere is a home for thoughtful writing, generous curiosity, and the conversations that start when someone puts an idea into words.</p><Link to="/register" className="btn btn-gradient">Find your voice <i className="bi bi-arrow-up-right" /></Link></div>
    <div className="about-values"><div><span>01</span><h2>Make room for nuance.</h2><p>Not every thought needs to fit in a headline. We make space for the longer version, the honest version, the still-figuring-it-out version.</p></div><div><span>02</span><h2>Read with curiosity.</h2><p>Good writing can take us somewhere unfamiliar and leave us with a better question than the one we started with.</p></div><div><span>03</span><h2>Share what matters.</h2><p>Your experience is your own, but the ideas inside it might be exactly what someone else needs to hear.</p></div></div>
  </section>;
}
