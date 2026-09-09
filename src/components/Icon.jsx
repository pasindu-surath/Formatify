import React from "react";
import {
  Moon,
  Menu,
  Lock,
  Image,
  FileText,
  Video,
  Upload,
  Plus,
  Download,
  Check,
  ShieldCheck,
  Zap,
  Code,
  PenTool,
  Files,
  MousePointer,
  Bookmark,
} from "lucide-react";
const icons = {
  moon: Moon,
  menu: Menu,
  lock: Lock,
  image: Image,
  file: FileText,
  video: Video,
  upload: Upload,
  plus: Plus,
  download: Download,
  check: Check,
  shield: ShieldCheck,
  zap: Zap,
  code: Code,
  pen: PenTool,
  files: Files,
  mouse: MousePointer,
  bookmark: Bookmark,
};
export default function Icon({ name }) {
  const Component = icons[name] || FileText;
  return <Component size={22} aria-hidden="true" />;
}
