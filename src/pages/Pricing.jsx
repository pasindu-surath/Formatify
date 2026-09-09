import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Converter from "../components/Converter.jsx";
export default function Pricing() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <p className="eyebrow">
          {"Free for the everyday. Pro for the busy days."}
        </p>
        <h1>
          {"Your files."}
          <br />
          <em>{"Your pace."}</em>
        </h1>
        <p className="lede">
          {
            "Get 10 free uploads per account, with no reset. Choose Pro for batch conversions and files without size limits."
          }
        </p>
      </section>
      <section className="wrap plans" aria-label="Available plans">
        <article className="plan">
          <span className="pill">{"The everyday essential"}</span>
          <h2>{"Free"}</h2>
          <p className="muted">
            {"For the file standing between you and your next step."}
          </p>
          <p className="price">
            {"LKR 0 "}
            <span>{"/ core tool"}</span>
          </p>
          <Link className="btn" to="/#converter">
            {"Convert a file "}
            <span aria-hidden="true">{"\u2197"}</span>
          </Link>
          <ul className="plan-list">
            <li>{"10 free uploads per account, ever"}</li>
            <li>{"Clean, ad-light interface"}</li>
            <li>{"1-Hour Privacy Guarantee"}</li>
          </ul>
          <p className="note">
            {
              "10 free uploads per account, in total. This allowance never resets."
            }
          </p>
        </article>
        <article className="plan featured">
          <span className="pill">{"For a fuller workflow"}</span>
          <h2>{"Pro"}</h2>
          <p className="muted">
            {"For the days when the whole folder needs a new format."}
          </p>
          <p className="price">
            {"LKR 350 "}
            <span>{"/ month"}</span>
          </p>
          <Link className="btn primary" to="/contact?topic=Pro">
            {"Ask about Pro "}
            <span aria-hidden="true">{"\u2197"}</span>
          </Link>
          <ul className="plan-list">
            <li>{"Batch conversions"}</li>
            <li>{"No file-size limits"}</li>
            <li>{"WhatsApp support for Pro users"}</li>
            <li>{"1-Hour Privacy Guarantee"}</li>
          </ul>
          <p className="note">
            {"Subscriptions are not active in this preview."}
          </p>
        </article>
      </section>
      <section className="wrap page-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">{"The details, without the fine print"}</p>
            <h2>{"Pick what fits your day."}</h2>
          </div>
          <p>{"Only two plans are defined: Free and Pro."}</p>
        </div>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              {"Free and Pro plan comparison"}
            </caption>
            <thead>
              <tr>
                <th scope="col">{"Feature"}</th>
                <th scope="col">{"Free"}</th>
                <th scope="col">{"Pro"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">{"Price"}</th>
                <td>{"LKR 0"}</td>
                <td>{"LKR 350/month"}</td>
              </tr>
              <tr>
                <th scope="row">{"Batch conversions"}</th>
                <td>{"Pro feature"}</td>
                <td>{"Included"}</td>
              </tr>
              <tr>
                <th scope="row">{"Free upload allowance"}</th>
                <td>{"10 uploads per account, lifetime; never resets"}</td>
                <td>{"Free allowance does not apply"}</td>
              </tr>
              <tr>
                <th scope="row">{"File-size limit"}</th>
                <td>{"Not specified"}</td>
                <td>{"No file-size limits"}</td>
              </tr>
              <tr>
                <th scope="row">{"WhatsApp support"}</th>
                <td>{"Pro feature"}</td>
                <td>{"Included"}</td>
              </tr>
              <tr>
                <th scope="row">{"Server file deletion"}</th>
                <td>{"Within one hour"}</td>
                <td>{"Within one hour"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="page-callout wrap">
        <Icon name="shield" />
        <div>
          <h3>{"Your files are your business."}</h3>
          <p>
            {
              "All uploaded files are automatically and permanently deleted from our servers within one hour."
            }
          </p>
          <p className="note">
            {
              "In this preview, supported image conversions happen on your device. No files are uploaded."
            }
          </p>
        </div>
        <Link to="/faq" className="btn">
          {"Read the FAQ"}
        </Link>
      </section>
    </main>
  );
}
