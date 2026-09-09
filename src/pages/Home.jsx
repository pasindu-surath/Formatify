import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Converter from "../components/Converter.jsx";
export default function Home() {
  const [notice, setNotice] = useState("");
  function bookmark() {
    setNotice(
      /Android|iPhone|iPad/i.test(navigator.userAgent)
        ? "Open your browser menu and choose Add Bookmark."
        : `Press ${/Mac/.test(navigator.platform) ? "⌘" : "Ctrl"} + D to bookmark Formatify.`,
    );
  }
  return (
    <>
      <main id="main">
        <section className="hero">
          <div className="wrap">
            <div className="pill">
              <span>{"Less friction."}</span>
              {" More creating. "}
              <span aria-hidden="true">{"\u2197"}</span>
            </div>
            <h1>
              {"Right file. "}
              <em>{"Right format."}</em>
              <br />
              {"Right back to work."}
            </h1>
            <p className="lede">
              {"Images, documents, and media. Converted in moments."}
              <br />
              {"A little tool that keeps your big ideas moving."}
            </p>
            <div className="hero-actions">
              <Link to="#converter" className="btn primary">
                {"Convert your file "}
                <span aria-hidden="true">{"\u2193"}</span>
              </Link>
              <Link to="#formats" className="btn">
                {"Explore formats "}
                <span aria-hidden="true">{"\u2197"}</span>
              </Link>
            </div>
            <Converter />
            <div className="small-checks">
              <span>
                <Icon name="check" />
                {" 10 free uploads per account"}
              </span>
              <span>
                <Icon name="shield" />
                {" Privacy comes first"}
              </span>
              <span>
                <Icon name="zap" />
                {" Straight to the point"}
              </span>
            </div>
            <div className="formats-strip">
              <span>{"ONE TOOL. FEWER FORMAT PROBLEMS."}</span>
              <b>{"HEIC"}</b>
              <b>{"JPG"}</b>
              <b>{"PNG"}</b>
              <b>{"SVG"}</b>
              <b>{"WebP"}</b>
              <b>{"PDF"}</b>
            </div>
          </div>
        </section>
        <section className="trust" aria-label="Privacy and engineering">
          <div className="wrap trust-inner">
            <div className="trust-item">
              <Icon name="shield" />
              <div>
                <strong>{"Your files. Your business."}</strong>
                <p>
                  {
                    "1-Hour Privacy Guarantee: uploaded files are permanently deleted from our servers within one hour."
                  }
                </p>
              </div>
            </div>
            <div className="trust-item">
              <Icon name="code" />
              <div>
                <strong>{"Small tool. Serious engineering."}</strong>
                <p>
                  {
                    "Engineered by an award-winning team recognized at SLIIT Codefest."
                  }
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="content">
          <div className="wrap split">
            <div className="copy">
              <p className="eyebrow">{"Built for your flow"}</p>
              <h2>
                {"\u201cUnsupported format\u201d"}
                <br />
                {"shouldn\u2019t stop your day."}
              </h2>
              <p>
                {
                  "A client sends an iPhone photo. A website needs a PNG. You just need a file that works\u2014not another editing app to open."
                }
              </p>
              <div className="steps">
                <div className="step">
                  <span>{"1"}</span>
                  <strong>{"Upload the file you have."}</strong>
                </div>
                <div className="step">
                  <span>{"2"}</span>
                  <strong>{"Choose the format you need."}</strong>
                </div>
                <div className="step">
                  <span>{"3"}</span>
                  <strong>{"Download. Get back to creating."}</strong>
                </div>
              </div>
            </div>
            <div className="sample">
              <div className="sample-top">
                <span>{"YOUR NEXT PROJECT, UNBLOCKED"}</span>
                <Icon name="image" />
              </div>
              <img
                src="/assets/images/architecture.jpg"
                alt="Orange architectural facade used as a sample creative project asset"
                width="900"
                height="600"
                loading="lazy"
              />
              <div className="file-cards">
                <div className="file-card">
                  {"client-photo.heic"}
                  <small>{"The file you received"}</small>
                </div>
                <span className="active" aria-hidden="true">
                  {"\u2192"}
                </span>
                <div className="file-card">
                  {"client-photo.jpg"}
                  <small>{"The format you need"}</small>
                </div>
              </div>
              <p className="note">{"Illustrative conversion example."}</p>
            </div>
          </div>
        </section>
        <section className="content formats-section" id="formats">
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">
                  {"A more useful file, in a few clicks"}
                </p>
                <h2>
                  {"Different files."}
                  <br />
                  {"One familiar workflow."}
                </h2>
              </div>
              <p>
                {
                  "From a last-minute client asset to a document handoff. Keep the tools you need close."
                }
              </p>
            </div>
            <div className="bento">
              <article className="feature">
                <div>
                  <Icon name="image" />
                  <h3>{"Images that fit the brief."}</h3>
                  <p>
                    {
                      "Turn iPhone HEIC photos into JPGs and WebP images into PNGs. Make the format fit your next step."
                    }
                  </p>
                </div>
                <div className="format-art" aria-hidden="true">
                  <b>{"HEIC"}</b>
                  <span>{"\u2192"}</span>
                  <b>{"JPG"}</b>
                </div>
              </article>
              <article className="feature">
                <Icon name="pen" />
                <h3>{"Vector to ready-to-use."}</h3>
                <p>
                  {
                    "Convert SVG logos and graphics to PNG for your everyday design and development work."
                  }
                </p>
              </article>
              <article className="feature">
                <Icon name="files" />
                <h3>{"Bring PDFs together."}</h3>
                <p>
                  {
                    "Merge PDF documents into one file. A simpler way to hand things over."
                  }
                </p>
              </article>
              <article className="feature">
                <Icon name="video" />
                <h3>{"Make room for media."}</h3>
                <p>
                  {
                    "Compress video files when your next step calls for something smaller."
                  }
                </p>
              </article>
              <article className="feature">
                <Icon name="mouse" />
                <h3>{"A clear path to Download."}</h3>
                <p>
                  {
                    "An ad-light interface, straightforward controls, and no fake download buttons."
                  }
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className="content" id="pro">
          <div className="wrap">
            <div className="pro">
              <div>
                <p className="eyebrow">{"Formatify Pro"}</p>
                <h2>
                  {"More files."}
                  <br />
                  {"Less repetitive work."}
                </h2>
                <p className="muted">
                  {"For the days when one file becomes a whole folder."}
                </p>
                <div className="pro-features">
                  <span>{"\u2713 Batch conversions"}</span>
                  <span>{"\u2713 No file-size limits"}</span>
                </div>
              </div>
              <div className="pro-price">
                <span className="pill">{"Your workflow, upgraded"}</span>
                <div>
                  <strong>{"LKR 350"}</strong>
                  <small>{" / month"}</small>
                </div>
                <a
                  className="btn primary"
                  href="mailto:hello@formatify.com?subject=Formatify%20Pro"
                >
                  {"Ask about Pro "}
                  <span aria-hidden="true">{"\u2197"}</span>
                </a>
                <small>{"WhatsApp support for Pro users."}</small>
              </div>
            </div>
          </div>
        </section>
        <section className="bookmark">
          <div className="wrap">
            <p className="eyebrow">{"Future you will thank you"}</p>
            <h2>{"Wrong format? You know where to go."}</h2>
            <p>{"Keep Formatify one shortcut away."}</p>
            <button className="btn" id="bookmark" onClick={bookmark}>
              <Icon name="bookmark" />
              {" Bookmark Formatify "}
              <kbd id="shortcut">{"Ctrl + D"}</kbd>
            </button>
          </div>
        </section>
      </main>
      {notice && (
        <div className="toast" role="status" onClick={() => setNotice("")}>
          {notice}
          <button
            className="ml-4"
            aria-label="Dismiss"
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
