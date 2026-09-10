import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Converter from "../components/Converter.jsx";
export default function Contact() {
  const [message, setMessage] = useState("");
  const [params] = useSearchParams();
  const topic = params.get("topic") === "Pro" ? "Pro" : "General question";
  function submitContact(e) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    location.href =
      "mailto:hello@formatify.com?subject=" +
      encodeURIComponent("Formatify: " + d.get("topic")) +
      "&body=" +
      encodeURIComponent(
        "Name: " +
          d.get("name") +
          "\nReply email: " +
          d.get("email") +
          "\n\n" +
          d.get("message"),
      );
    setMessage(
      "Your email app should open with a draft. Review and send it there. If it does not open, email hello@formatify.com directly.",
    );
  }
  return (
    <main id="main">
      <section className="page-hero wrap">
        <p className="eyebrow">{"Let\u2019s get you moving again"}</p>
        <h1>
          {"A question?"}
          <br />
          <em>{"Drop us a line."}</em>
        </h1>
        <p className="lede">
          {
            "A format question, a Pro enquiry, or something that isn\u2019t working. We\u2019re listening."
          }
        </p>
      </section>
      <section className="wrap contact-layout">
        <div className="contact-info">
          <article>
            <div className="upload-icon">
              <Icon name="file" />
            </div>
            <h2>{"Email us."}</h2>
            <a className="email-link" href="mailto:pasindusurath23460@gmail.com">
              {"pasindusurath23460@gmail.com \u2197"}
            </a>
            <p className="muted">{"For questions about Formatify and Pro."}</p>
          </article>
          <article className="contact-small">
            <Icon name="zap" />
            <h3>{"A little more support with Pro."}</h3>
            <p className="muted">
              {"WhatsApp support is available for Pro users."}
            </p>
            <a className="text-link" href="https://wa.me/94787168496">
              {"Chat on WhatsApp: 0787168496 \u2192"}
            </a>
          </article>
          <article className="contact-small">
            <Icon name="image" />
            <h3>
              {"Based in Sri Lanka."}
              <br />
              {"Built for your corner of the world."}
            </h3>
            <p className="muted">{"Formatify serves a global audience."}</p>
          </article>
        </div>
        <form
          id="contact-form"
          className="contact-form"
          onSubmit={submitContact}
        >
          <h2>{"What can we help with?"}</h2>
          <p className="muted">
            {"Write your message here, then open it in your email app."}
          </p>
          <label htmlFor="contact-name">{"Your name"}</label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            maxLength="100"
            placeholder="Your name"
          />
          <label htmlFor="contact-email">{"Your email"}</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength="254"
            placeholder="you@example.com"
          />
          <label htmlFor="contact-topic">{"What\u2019s it about?"}</label>
          <select id="contact-topic" name="topic" defaultValue={topic}>
            <option>{"General question"}</option>
            <option>{"Pro"}</option>
            <option>{"Conversion help"}</option>
            <option>{"Privacy"}</option>
          </select>
          <label htmlFor="contact-message">{"Your message"}</label>
          <textarea
            id="contact-message"
            name="message"
            rows="5"
            required
            maxLength="3000"
            placeholder="Tell us what you need help with."
          ></textarea>
          <button className="btn primary" type="submit">
            {"Open email draft "}
            <span aria-hidden="true">{"\u2197"}</span>
          </button>
          <p className="note">
            {
              "This opens your email app. Nothing is sent until you send it there. Please don\u2019t include sensitive files or passwords."
            }
          </p>
          <p role="status">{message}</p>
        </form>
      </section>
    </main>
  );
}
