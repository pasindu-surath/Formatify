import React, { useRef, useState } from "react";

// Pass real asynchronous authentication callbacks to enable the form.
// Each callback receives { email, password } and must throw on failure.
export default function Account({ onLogin, onSignUp }) {
  const [mode, setMode] = useState("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const form = useRef(null);
  const tabs = useRef([]);
  const signup = mode === "signup";
  const authenticate = signup ? onSignUp : onLogin;
  const connected = typeof authenticate === "function";

  function changeMode(next) {
    if (busy) return;
    setMode(next);
    setMessage("");
    setShow(false);
    form.current?.reset();
  }
  function tabKey(event, index) {
    if (busy) return;
    let next;
    if (["ArrowLeft", "ArrowRight"].includes(event.key)) next = 1 - index;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    else return;
    event.preventDefault();
    changeMode(next ? "signup" : "login");
    tabs.current[next]?.focus();
  }
  async function submit(event) {
    event.preventDefault();
    if (!connected || busy) return;
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email")).trim();
    const password = String(data.get("password"));
    if (signup && password !== data.get("confirmation")) {
      setMessage("Your passwords do not match.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await authenticate({ email, password });
      form.current?.reset();
      setMessage(
        signup
          ? "Sign-up request completed. Follow your account verification instructions."
          : "Login completed.",
      );
    } catch {
      setMessage(
        "We couldn’t complete your request. Check your details and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <main id="main" className="wrap account-layout">
        <section className="account-story">
          <p className="eyebrow">Your next file is waiting</p>
          <h1>
            Back to
            <br />
            <em>your flow.</em>
          </h1>
          <p className="lede">
            Less time changing formats.
            <br />
            More time making things happen.
          </p>
          <div className="allowance">
            <strong>10 free uploads. Yours to use.</strong>
            <p>
              Each account gets 10 free file uploads in total. This allowance
              never resets.
            </p>
          </div>
          <p className="muted">
            Formatify Pro: <strong>LKR 350/month.</strong>
          </p>
        </section>
        <section className="account-card" aria-label="Formatify account">
          <div className="tabs" role="tablist" aria-label="Account action">
            {["login", "signup"].map((tab, i) => (
              <button
                key={tab}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className="tab"
                id={`${tab}-tab`}
                type="button"
                role="tab"
                aria-selected={mode === tab}
                aria-controls="account-panel"
                tabIndex={mode === tab ? 0 : -1}
                disabled={busy}
                onClick={() => changeMode(tab)}
                onKeyDown={(e) => tabKey(e, i)}
              >
                {i ? "Sign Up" : "Login"}
              </button>
            ))}
          </div>
          <div
            id="account-panel"
            role="tabpanel"
            aria-labelledby={`${mode}-tab`}
          >
            <div className="upload-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V6a4 4 0 0 1 8 0v4" />
              </svg>
            </div>
            <h2>
              {signup ? "Make room for your next idea." : "Welcome back."}
            </h2>
            <p className="muted">
              {signup
                ? "Create your account for 10 lifetime free uploads."
                : "Log in to continue your workflow."}
            </p>
            {!connected && (
              <div className="account-notice">
                <strong>Account preview</strong>
                <p>
                  Authentication is not connected. No account can be created
                  here, and no credentials are collected.
                </p>
              </div>
            )}
            <form ref={form} onSubmit={submit}>
              <fieldset disabled={!connected || busy}>
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
                <label htmlFor="password">Password</label>
                <div className="password-row">
                  <input
                    id="password"
                    name="password"
                    type={show ? "text" : "password"}
                    autoComplete={signup ? "new-password" : "current-password"}
                    placeholder="Your password"
                    required
                  />
                  <button
                    className="btn"
                    type="button"
                    aria-label={show ? "Hide password" : "Show password"}
                    aria-pressed={show}
                    onClick={() => setShow(!show)}
                  >
                    {show ? "Hide" : "Show"}
                  </button>
                </div>
                {signup && (
                  <>
                    <label htmlFor="confirmation">Confirm password</label>
                    <input
                      id="confirmation"
                      name="confirmation"
                      type={show ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter your password again"
                      required
                    />
                  </>
                )}
                <button className="btn primary" type="submit">
                  {busy
                    ? "Please wait…"
                    : !connected
                      ? `${signup ? "Sign-up" : "Login"} unavailable`
                      : signup
                        ? "Create account"
                        : "Login"}
                </button>
              </fieldset>
              <p className="status" role="status" aria-live="polite">
                {message}
              </p>
            </form>
            <p className="note">
              Questions? <a href="mailto:hello@formatify.com">Contact us</a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
