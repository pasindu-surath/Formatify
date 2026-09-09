import React, { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import * as pdfjs from "pdfjs-dist";
import pdfWorkerURL from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import Icon from "./Icon.jsx";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerURL;
const base = import.meta.env.BASE_URL;
const categories = ["images", "documents", "media"];
const outputOptions = {
  images: [
    ["image/png", "PNG"],
    ["image/jpeg", "JPG"],
    ["image/webp", "WebP"],
  ],
  documents: [
    ["image/png", "PNG — one image per page"],
    ["image/jpeg", "JPG — one image per page"],
  ],
  media: [
    ["mp3", "MP3 — extract audio"],
    ["mp4", "MP4 — convert / compress"],
  ],
};
const extension = (type) =>
  type === "image/jpeg" ? "jpg" : type.split("/").pop();
const stem = (name) => name.replace(/\.[^.]+$/, "");
function encodeCanvas(canvas, type) {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => {
        if (!blob)
          reject(
            new Error(
              "Image encoding failed. Try a smaller image or lower PDF scale.",
            ),
          );
        else if (blob.type !== type)
          reject(
            new Error(
              "This browser does not support the selected image format.",
            ),
          );
        else resolve(blob);
      },
      type,
      0.95,
    ),
  );
}

export default function Converter() {
  const [category, setCategory] = useState("images");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("image/png");
  const [scale, setScale] = useState(2);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(null);
  const [results, setResults] = useState([]);
  const input = useRef(null),
    tabs = useRef([]);
  const engine = useRef(null),
    pdfTask = useRef(null),
    renderTask = useRef(null);
  const urls = useRef([]),
    job = useRef(0),
    active = useRef(false);

  useEffect(
    () => () => {
      job.current++;
      engine.current?.terminate();
      renderTask.current?.cancel();
      pdfTask.current?.destroy().catch(() => {});
      urls.current.forEach(URL.revokeObjectURL);
    },
    [],
  );

  function clearResults() {
    urls.current.forEach(URL.revokeObjectURL);
    urls.current = [];
    setResults([]);
  }
  function changeCategory(next) {
    if (active.current) return;
    setCategory(next);
    setType(outputOptions[next][0][0]);
    setFile(null);
    setPassword("");
    setStatus("");
    setProgress(null);
    clearResults();
    if (input.current) input.current.value = "";
  }
  function receive(files) {
    if (active.current) return;
    clearResults();
    setFile(null);
    setPassword("");
    setProgress(null);
    if (files.length !== 1) {
      setStatus("Choose one file at a time.");
      return;
    }
    const selected = files[0];
    const valid =
      category === "images"
        ? /\.(png|jpe?g|webp|svg)$/i.test(selected.name)
        : category === "documents"
          ? /\.pdf$/i.test(selected.name)
          : /\.(mp4|mov|mkv|webm|avi|m4v|mpeg|mpg|3gp|ogv)$/i.test(
              selected.name,
            );
    if (!valid) {
      setStatus(
        category === "images"
          ? "Choose PNG, JPG, WebP or SVG. HEIC is not supported yet."
          : category === "documents"
            ? "Choose a PDF file."
            : "Choose a video file such as MP4, MOV or WebM.",
      );
      return;
    }
    setFile(selected);
    setStatus("Selected locally. Your file will not be uploaded.");
  }
  function cancel() {
    job.current++;
    active.current = false;
    engine.current?.terminate();
    engine.current = null;
    renderTask.current?.cancel();
    renderTask.current = null;
    pdfTask.current?.destroy().catch(() => {});
    pdfTask.current = null;
    setBusy(false);
    setProgress(null);
    setStatus("Cancelled. Your file was not uploaded.");
  }
  async function convert() {
    if (!file || active.current) return;
    active.current = true;
    setBusy(true);
    clearResults();
    setProgress(null);
    const id = ++job.current;
    const current = () => id === job.current;
    const check = () => {
      if (!current()) throw new Error("Cancelled");
    };
    const publish = (blob, name) => {
      check();
      const url = URL.createObjectURL(blob);
      urls.current.push(url);
      setResults((items) => [...items, { url, name, size: blob.size }]);
    };
    let source, loadingTask, ff;
    try {
      if (category === "images") {
        setStatus("Converting image locally…");
        source = URL.createObjectURL(file);
        const image = new Image();
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = () =>
            reject(new Error("This image could not be read."));
          image.src = source;
        });
        check();
        if (!image.naturalWidth || !image.naturalHeight)
          throw new Error("The image has no valid dimensions.");
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        if (type === "image/jpeg") {
          context.fillStyle = "#fff";
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        context.drawImage(image, 0, 0);
        const blob = await encodeCanvas(canvas, type);
        canvas.width = canvas.height = 0;
        publish(blob, `${stem(file.name)}.${extension(type)}`);
        setStatus("Image ready. Your file never left this device.");
      } else if (category === "documents") {
        setStatus("Opening PDF locally…");
        const data = new Uint8Array(await file.arrayBuffer());
        check();
        loadingTask = pdfjs.getDocument({
          data,
          password: password || undefined,
          isEvalSupported: false,
          cMapUrl: `${base}vendor/pdf/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `${base}vendor/pdf/standard_fonts/`,
          wasmUrl: `${base}vendor/pdf/wasm/`,
        });
        pdfTask.current = loadingTask;
        const pdf = await loadingTask.promise;
        check();
        let reduced = false;
        // Render sequentially; do not hold every page canvas in memory.
        for (let number = 1; number <= pdf.numPages; number++) {
          check();
          setStatus(`Rendering page ${number} of ${pdf.numPages}…`);
          const page = await pdf.getPage(number);
          check();
          const original = page.getViewport({ scale: 1 });
          // Bound each canvas to 16 megapixels and 8192 pixels per side.
          const safeScale = Math.min(
            scale,
            Math.sqrt(16000000 / (original.width * original.height)),
            8192 / original.width,
            8192 / original.height,
          );
          if (safeScale < scale) reduced = true;
          const viewport = page.getViewport({ scale: safeScale });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          try {
            renderTask.current = page.render({
              canvasContext: canvas.getContext("2d"),
              viewport,
              background: "rgb(255,255,255)",
            });
            await renderTask.current.promise;
            check();
            const blob = await encodeCanvas(canvas, type);
            publish(
              blob,
              `${stem(file.name)}-page-${String(number).padStart(3, "0")}.${extension(type)}`,
            );
          } finally {
            canvas.width = canvas.height = 0;
            page.cleanup();
          }
          setProgress(Math.round((number / pdf.numPages) * 100));
        }
        setPassword("");
        setStatus(
          `${pdf.numPages} page images ready. Nothing was uploaded.${reduced ? " Oversized pages were rendered at a lower scale to fit browser limits." : ""}`,
        );
      } else {
        setStatus(
          "Loading the local video engine. The first load may take a moment…",
        );
        ff = new FFmpeg();
        engine.current = ff;
        ff.on("progress", ({ progress: value }) => {
          if (current())
            setProgress(Math.max(0, Math.min(99, Math.round(value * 100))));
        });
        await ff.load({
          classWorkerURL: `${base}vendor/ffmpeg/worker.js`,
          coreURL: `${base}vendor/ffmpeg-core/ffmpeg-core.js`,
          wasmURL: `${base}vendor/ffmpeg-core/ffmpeg-core.wasm`,
        });
        check();
        const suffix = file.name.split(".").pop().toLowerCase();
        const inputName = `input.${suffix}`,
          outputName = `output.${type}`;
        await ff.writeFile(inputName, new Uint8Array(await file.arrayBuffer()));
        check();
        setStatus(
          type === "mp3"
            ? "Extracting audio locally…"
            : "Encoding MP4 locally…",
        );
        const args =
          type === "mp3"
            ? [
                "-i",
                inputName,
                "-map",
                "0:a:0",
                "-vn",
                "-c:a",
                "libmp3lame",
                "-b:a",
                "192k",
                outputName,
              ]
            : [
                "-i",
                inputName,
                "-map",
                "0:v:0",
                "-map",
                "0:a:0?",
                "-vf",
                "scale=trunc(iw/2)*2:trunc(ih/2)*2",
                "-c:v",
                "libx264",
                "-preset",
                "veryfast",
                "-crf",
                "28",
                "-pix_fmt",
                "yuv420p",
                "-c:a",
                "aac",
                "-b:a",
                "128k",
                "-movflags",
                "+faststart",
                outputName,
              ];
        const exitCode = await ff.exec(args);
        check();
        if (exitCode !== 0)
          throw new Error(
            type === "mp3"
              ? "Audio extraction failed. Check that the video has an audio track and a supported codec."
              : "Video conversion failed. The codec may be unsupported, or the file may exceed browser memory.",
          );
        const bytes = await ff.readFile(outputName);
        check();
        const blob = new Blob([bytes], {
          type: type === "mp3" ? "audio/mpeg" : "video/mp4",
        });
        publish(
          blob,
          `${stem(file.name)}${type === "mp4" ? "-compressed" : ""}.${type}`,
        );
        setProgress(100);
        setStatus(
          type === "mp4" && blob.size >= file.size
            ? "MP4 ready. This output is not smaller than the original; compression savings depend on the source."
            : "Conversion ready. Your file never left this device.",
        );
      }
    } catch (error) {
      if (current())
        setStatus(
          error.name === "PasswordException"
            ? "This PDF needs the correct password. Enter it below and try again."
            : error.message || "Conversion failed. Try a smaller file.",
        );
    } finally {
      if (source) URL.revokeObjectURL(source);
      if (loadingTask) await loadingTask.destroy().catch(() => {});
      if (ff) ff.terminate(); // Release input/output files and WASM memory.
      if (current()) {
        engine.current = null;
        pdfTask.current = null;
        renderTask.current = null;
        active.current = false;
        setBusy(false);
      }
    }
  }
  function tabKey(event, index) {
    let next;
    if (["ArrowLeft", "ArrowRight"].includes(event.key))
      next = (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 2;
    else return;
    event.preventDefault();
    if (busy) return;
    changeCategory(categories[next]);
    tabs.current[next]?.focus();
  }
  return (
    <div className="browser" id="converter">
      <div className="browser-bar">
        <span className="dots" aria-hidden="true">
          ● ● ●
        </span>
        <span>
          <Icon name="lock" /> Local converter
        </span>
        <span>No file uploads</span>
      </div>
      <div className="converter">
        <div className="tabs" role="tablist" aria-label="Conversion category">
          {categories.map((name, index) => (
            <button
              key={name}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              className="tab"
              id={`tab-${name}`}
              role="tab"
              aria-selected={category === name}
              aria-controls="tool-panel"
              tabIndex={category === name ? 0 : -1}
              disabled={busy}
              onClick={() => changeCategory(name)}
              onKeyDown={(event) => tabKey(event, index)}
            >
              <Icon name={["image", "file", "video"][index]} />{" "}
              {["Images", "PDF", "Video"][index]}
            </button>
          ))}
        </div>
        <div
          id="tool-panel"
          role="tabpanel"
          aria-labelledby={`tab-${category}`}
        >
          <div
            className={`drop ${over ? "over" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              if (!busy) setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setOver(false);
              receive([...event.dataTransfer.files]);
            }}
          >
            <div className="upload-icon">
              <Icon name="upload" />
            </div>
            <h2 className="max-w-full break-all">
              {file ? file.name : "Drop your file here."}
            </h2>
            <p>
              {file
                ? `${(file.size / 1048576).toFixed(2)} MB · Stays on this device`
                : "Choose a file to process entirely in your browser."}
            </p>
            <input
              ref={input}
              type="file"
              hidden
              disabled={busy}
              accept={
                category === "images"
                  ? ".png,.jpg,.jpeg,.webp,.svg"
                  : category === "documents"
                    ? ".pdf"
                    : "video/*,.mkv,.avi"
              }
              onChange={(event) => receive([...event.target.files])}
            />
            <button
              className="btn primary"
              disabled={busy}
              onClick={() => input.current.click()}
            >
              Choose File <Icon name="plus" />
            </button>
          </div>
          <div className="conversion-row flex-wrap">
            <label htmlFor="output">Convert to</label>
            <select
              id="output"
              value={type}
              disabled={busy}
              onChange={(event) => {
                setType(event.target.value);
                clearResults();
                setStatus("");
                setProgress(null);
              }}
            >
              {outputOptions[category].map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <button
              className="btn primary"
              disabled={!file || busy}
              onClick={convert}
            >
              {busy ? "Working…" : "Convert →"}
            </button>
            {busy && (
              <button className="btn" onClick={cancel}>
                Cancel
              </button>
            )}
          </div>
          {category === "documents" && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="pdf-scale">PDF render scale</label>
                <select
                  id="pdf-scale"
                  disabled={busy}
                  value={scale}
                  onChange={(event) => setScale(Number(event.target.value))}
                >
                  <option value={1}>1× (72 DPI)</option>
                  <option value={2}>2× (144 DPI)</option>
                  <option value={3}>3× (216 DPI)</option>
                </select>
              </div>
              <div>
                <label htmlFor="pdf-password">PDF password, if required</label>
                <input
                  id="pdf-password"
                  type="password"
                  autoComplete="off"
                  disabled={busy}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>
          )}
          {busy && (
            <progress
              className="mt-4"
              max={100}
              value={progress === null ? undefined : progress}
              aria-label="Conversion progress"
            />
          )}
          <p className="status" role="status" aria-live="polite">
            {status}
          </p>
          {results.length > 0 && (
            <ul className="mt-4 grid gap-2" aria-label="Converted files">
              {results.map((result) => (
                <li key={result.url}>
                  <a
                    className="btn w-full break-all"
                    href={result.url}
                    download={result.name}
                  >
                    <Icon name="download" /> {result.name} (
                    {(result.size / 1048576).toFixed(2)} MB)
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="note">
            Files are processed on your device. Video conversion can be slow and
            is limited by browser memory. PDF pages download separately. HEIC
            and PDF merging are not included in this converter.
          </p>
        </div>
      </div>
    </div>
  );
}
