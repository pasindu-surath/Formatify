import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";
export default function Converter() {
  const [category, setCategory] = useState("images"),
    [file, setFile] = useState(null),
    [type, setType] = useState("image/png"),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [over, setOver] = useState(false),
    [result, setResult] = useState(null);
  const input = useRef(null),
    tabs = useRef([]),
    url = useRef(null),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (url.current) URL.revokeObjectURL(url.current);
    };
  }, []);
  function clearResult() {
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = null;
    setResult(null);
  }
  function changeCategory(next) {
    if (busy) return;
    setCategory(next);
    setFile(null);
    setStatus("");
    clearResult();
    if (input.current) input.current.value = "";
  }
  function receive(files) {
    if (busy) return;
    clearResult();
    setFile(null);
    if (files.length !== 1) {
      setStatus("Choose one file. Batch conversion is a Pro feature.");
      return;
    }
    const f = files[0];
    setFile(f);
    setStatus(
      category !== "images"
        ? "This tool is not active in this preview. No file was uploaded."
        : !/\.(png|jpe?g|webp|svg)$/i.test(f.name)
          ? "Choose PNG, JPG, WebP or SVG. HEIC needs a conversion service."
          : "Your file stays on this device.",
    );
  }
  const supported =
    file && category === "images" && /\.(png|jpe?g|webp|svg)$/i.test(file.name);
  async function convert() {
    if (!supported || busy) return;
    setBusy(true);
    setStatus("Converting your image…");
    let source;
    try {
      source = URL.createObjectURL(file);
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () =>
          reject(new Error("This image could not be read. Try another file."));
        img.src = source;
      });
      if (!img.naturalWidth || !img.naturalHeight)
        throw new Error("The image needs valid dimensions.");
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (type === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, type, 0.95),
      );
      if (!blob)
        throw new Error(
          "The image is too large for this browser. Try a smaller file.",
        );
      if (blob.type !== type)
        throw new Error(
          "Your browser does not support this output. Choose PNG or JPG.",
        );
      if (!mounted.current) return;
      clearResult();
      url.current = URL.createObjectURL(blob);
      setResult({
        url: url.current,
        name:
          file.name.replace(/\.[^.]+$/, "") +
          "." +
          (type === "image/jpeg" ? "jpg" : type.split("/")[1]),
      });
      setStatus(
        `Ready. ${canvas.width} × ${canvas.height} pixels. Your file never left this device.`,
      );
    } catch (e) {
      if (mounted.current) setStatus(e.message);
    } finally {
      if (source) URL.revokeObjectURL(source);
      if (mounted.current) setBusy(false);
    }
  }
  function key(event, index) {
    let next;
    if (["ArrowLeft", "ArrowRight"].includes(event.key))
      next = (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 2;
    else return;
    event.preventDefault();
    if (busy) return;
    changeCategory(["images", "documents", "media"][next]);
    tabs.current[next]?.focus();
  }
  return (
    <div className="browser" id="converter">
      <div className="browser-bar">
        <span className="dots" aria-hidden="true">
          ● ● ●
        </span>
        <span>
          <Icon name="lock" /> formatify / converter
        </span>
        <span>Free tool</span>
      </div>
      <div className="converter">
        <div className="tabs" role="tablist" aria-label="Conversion category">
          {["images", "documents", "media"].map((name, i) => (
            <button
              ref={(el) => {
                tabs.current[i] = el;
              }}
              key={name}
              className="tab"
              role="tab"
              id={"tab-" + name}
              aria-selected={category === name}
              aria-controls="tool-panel"
              tabIndex={category === name ? 0 : -1}
              disabled={busy}
              onClick={() => changeCategory(name)}
              onKeyDown={(e) => key(e, i)}
            >
              <Icon name={["image", "file", "video"][i]} />{" "}
              {name[0].toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>
        <div
          id="tool-panel"
          role="tabpanel"
          aria-labelledby={"tab-" + category}
        >
          <div
            className={"drop " + (over ? "over" : "")}
            onDragOver={(e) => {
              e.preventDefault();
              if (!busy) setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              receive([...e.dataTransfer.files]);
            }}
          >
            <div className="upload-icon">
              <Icon name="upload" />
            </div>
            <h2 className="max-w-full break-all">
              {file ? file.name : "Drop it here. We’ll take it from here."}
            </h2>
            <p>
              {file
                ? `${(file.size / 1048576).toFixed(2)} MB`
                : `Choose ${category === "images" ? "an image" : category === "documents" ? "a PDF" : "a video"} or drop it here.`}
            </p>
            <input
              ref={input}
              type="file"
              hidden
              disabled={busy}
              accept={
                category === "images"
                  ? "image/*,.heic,.heif,.svg"
                  : category === "documents"
                    ? ".pdf"
                    : "video/*"
              }
              onChange={(e) => receive([...e.target.files])}
            />
            <button
              className="btn primary"
              disabled={busy}
              onClick={() => input.current.click()}
            >
              Upload File <Icon name="plus" />
            </button>
          </div>
          <div className="conversion-row">
            <label htmlFor="output">Convert to</label>
            <select
              id="output"
              value={type}
              disabled={busy || category !== "images"}
              onChange={(e) => {
                setType(e.target.value);
                clearResult();
              }}
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WebP</option>
            </select>
            {result ? (
              <a
                className="btn primary ml-auto"
                href={result.url}
                download={result.name}
              >
                Download <Icon name="download" />
              </a>
            ) : (
              <button
                className="btn primary"
                disabled={!supported || busy}
                onClick={convert}
              >
                {busy ? "Converting…" : "Convert →"}
              </button>
            )}
          </div>
          {busy && <progress aria-label="Conversion progress" />}
          <p className="status" role="status" aria-live="polite">
            {status}
          </p>
          <p className="note">
            {category === "images"
              ? "Preview: PNG, JPG, WebP and SVG convert locally. HEIC needs a conversion service."
              : "PDF merging and video compression require a conversion service and are not active in this preview."}{" "}
            The lifetime limit of 10 free uploads per account is not enforced
            yet.
          </p>
        </div>
      </div>
    </div>
  );
}
