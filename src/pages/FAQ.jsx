import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Converter from "../components/Converter.jsx";
export default function FAQ() {
  return (
    <main id="main">
      <section className="page-hero wrap">
        <p className="eyebrow">{"A little clarity goes a long way"}</p>
        <h1>
          {"Good questions."}
          <br />
          <em>{"Straight answers."}</em>
        </h1>
        <p className="lede">
          {"The essentials on formats, privacy, and getting back to work."}
        </p>
      </section>
      <div className="wrap faq-layout">
        <aside className="faq-aside">
          <strong>{"On this page"}</strong>
          <Link to="#conversions">{"Files & conversions"}</Link>
          <Link to="#privacy">{"Privacy & accounts"}</Link>
          <div className="aside-note">
            <Icon name="file" />
            <h3>{"Still have a question?"}</h3>
            <p className="muted">{"Let\u2019s get it cleared up."}</p>
            <Link to="/contact" className="text-link">
              {"Contact us \u2192"}
            </Link>
          </div>
        </aside>
        <div>
          <section className="faq-group" id="conversions">
            <h2>{"Files & conversions"}</h2>
            <details>
              <summary>{"What can I use Formatify for?"}</summary>
              <p>
                {
                  "HEIC to JPG, WebP to PNG, SVG to PNG, PDF merging, and video compression are the services in the Formatify offering. This static preview currently converts browser-readable PNG, JPG, WebP and SVG images locally. The other tools are not yet active."
                }
              </p>
            </details>
            <details>
              <summary>
                {"Can I convert multiple files at the same time?"}
              </summary>
              <p>
                {
                  "Batch conversions are a Pro feature. The current preview handles one image at a time."
                }
              </p>
            </details>
            <details>
              <summary>{"Is there a maximum file size?"}</summary>
              <p>
                {
                  "The Free plan includes 10 uploads per account in total, with no reset. This is a file-count allowance, not a file-size limit. A maximum size for free files has not been specified. Pro offers no file-size limits. Local conversion in this preview is also limited by your device\u2019s available memory."
                }
              </p>
            </details>
            <details>
              <summary>{"Will my image become pixelated?"}</summary>
              <p>
                {
                  "The image converter in this preview retains the original pixel dimensions. JPG and WebP encoding can still change image quality. Converting a small source image does not add detail; choose PNG when you want to avoid additional lossy encoding."
                }
              </p>
            </details>
            <details>
              <summary>{"Does this work on my mobile phone?"}</summary>
              <p>
                {
                  "The interface is designed for mobile, tablet and desktop. Use Upload File on your phone. Available file types and local conversion depend on your browser and device."
                }
              </p>
            </details>
          </section>
          <section className="faq-group" id="privacy">
            <h2>{"Privacy & accounts"}</h2>
            <details>
              <summary>{"What happens to my uploaded files?"}</summary>
              <p>
                {
                  "Formatify\u2019s 1-Hour Privacy Guarantee means uploaded files are automatically and permanently deleted from its servers within one hour. In this preview, supported conversions happen locally and your files are not uploaded."
                }
              </p>
            </details>
            <details>
              <summary>{"Who can see my files?"}</summary>
              <p>
                {
                  "Files used by the local converter in this preview stay on your device. For details about access to files in the planned server-based tools, contact hello@formatify.com."
                }
              </p>
            </details>
            <details>
              <summary>{"Do I need to create an account?"}</summary>
              <p>
                {
                  "The Free plan provides 10 uploads per account over its lifetime. The allowance never resets. Account login and upload tracking are not connected in this preview, so its local converter does not enforce the allowance."
                }
              </p>
            </details>
            <details>
              <summary>{"How much does Pro cost?"}</summary>
              <p>
                {
                  "Pro costs LKR 350 per month. It includes batch conversions, no file-size limits, and WhatsApp support. Subscriptions are not active in this preview."
                }
              </p>
            </details>
          </section>
        </div>
      </div>
      <section className="bookmark wrap">
        <h2>{"Ready when your next file isn\u2019t."}</h2>
        <p>{"Your next conversion is a click away."}</p>
        <Link className="btn primary" to="/#converter">
          {"Upload File "}
          <span aria-hidden="true">{"\u2197"}</span>
        </Link>
      </section>
    </main>
  );
}
