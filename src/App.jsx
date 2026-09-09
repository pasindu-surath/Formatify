import React, { useEffect, useState } from "react";
import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Pricing from "./pages/Pricing.jsx";
import FAQ from "./pages/FAQ.jsx";
import Contact from "./pages/Contact.jsx";
import Account from "./pages/Account.jsx";
import Icon from "./components/Icon.jsx";
const navigation = [
  ["/", "Home"],
  ["/pricing", "Pricing & Pro Plans"],
  ["/faq", "FAQ"],
  ["/contact", "Contact"],
  ["/account", "Login / Sign Up"],
];
export default function App() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("formatify-theme") === "dark";
    } catch {
      return false;
    }
  });
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try {
      localStorage.setItem("formatify-theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);
  useEffect(() => {
    setMenu(false);
    document.title =
      (navigation.find(([p]) => p === location.pathname)?.[1] ||
        "Page not found") + " — Formatify";
    if (location.hash) {
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo(0, 0);
  }, [location]);
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-sans">
      <a href="#main" className="skip">
        Skip to content
      </a>
      <header className="nav">
        <div className="wrap nav-inner">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true">
              ↔
            </span>
            formatify<span className="active">.</span>
          </Link>
          <nav
            id="navigation"
            aria-label="Main navigation"
            className={"nav-links " + (menu ? "open" : "")}
          >
            {navigation.map(([path, label]) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="icon-btn"
              aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
              aria-pressed={dark}
              onClick={() => setDark(!dark)}
            >
              <Icon name="moon" />
            </button>
            <Link to="/#converter" className="btn primary">
              Convert a file ↗
            </Link>
            <button
              className="icon-btn menu-btn"
              aria-label="Toggle navigation"
              aria-expanded={menu}
              aria-controls="navigation"
              onClick={() => setMenu(!menu)}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/account" element={<Account />} />
          <Route
            path="*"
            element={
              <main id="main" className="wrap py-24">
                <h1>Page not found.</h1>
                <Link to="/" className="btn primary">
                  Back to Home
                </Link>
              </main>
            }
          />
        </Routes>
      </div>
      <footer>
        <div className="wrap">
          <div className="footer-top">
            <div>
              <Link to="/" className="logo">
                <span className="logo-mark">↔</span>formatify
                <span className="active">.</span>
              </Link>
              <p>Less converting. More creating.</p>
              <p>Built in Sri Lanka. Made for everywhere.</p>
            </div>
            <div className="footer-links">
              <div>
                <strong>Formatify</strong>
                <Link to="/#converter">Convert a file</Link>
                <Link to="/pricing">Pricing & Pro Plans</Link>
                <Link to="/faq">FAQ</Link>
              </div>
              <div>
                <strong>Let’s talk</strong>
                <a href="pasindusurath23460@gmail.com">pasindusurath23460@gmail.com</a>
                <a href="https://wa.me/94787168496">WhatsApp Pro: 0787168496</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Formatify. All rights reserved.</span>
            <span>Fast. Secure. Minimalist.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
