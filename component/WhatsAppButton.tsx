"use client";

import { FaWhatsapp } from "react-icons/fa6";
import { useEffect, useState } from "react";

const whatsappNumber = "201021164131";
const displayNumber = "01021164131";

export default function WhatsAppButton() {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");

  useEffect(() => {
    const html = document.documentElement;
    const updateDirection = () => setDirection(html.dir === "rtl" ? "rtl" : "ltr");

    updateDirection();
    const observer = new MutationObserver(updateDirection);
    observer.observe(html, { attributes: true, attributeFilter: ["dir"] });

    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-float whatsapp-float-${direction}`}
      aria-label={`Contact us on WhatsApp at ${displayNumber}`}
    >
      <span className="whatsapp-float-number" aria-hidden="true">
        {displayNumber}
      </span>
      <FaWhatsapp aria-hidden="true" className="whatsapp-float-icon" />
    </a>
  );
}