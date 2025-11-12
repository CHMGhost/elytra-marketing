"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";

export function FloatingContactButton() {
  const [hover, setHover] = useState(false);
  const pathname = usePathname();

  let type: "general" | "support" | "billing" = "general";
  if (pathname.includes("/status")) {
    type = "support";
  } else if (pathname.includes("/pricing")) {
    type = "billing";
  }

  const email =
    type === "support"
      ? "support@elytracloud.com"
      : type === "billing"
      ? "billing@elytracloud.com"
      : "hello@elytracloud.com";

  const subject =
    type === "support"
      ? "Elytracloud%20Support%20Request"
      : type === "billing"
      ? "Elytracloud%20Billing%20Inquiry"
      : "Elytracloud%20General%20Inquiry";

  const shortLabel =
    type === "support"
      ? "support"
      : type === "billing"
      ? "billing"
      : "hello";

  return (
    <div
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        href={`mailto:${email}?subject=${subject}&body=Hi%20Minor%2C%0A%0AI'm%20reaching%20out%20about%20${type}%20support.%20Here%27s%20a%20bit%20about%20my%20site%3A%0A%0ASite%3A%20%0ATier%3A%20Shell%20%7C%20Wing%20%7C%20Apex%0A%0AThanks!`}
        className="group flex items-center gap-3 rounded-full bg-blue-600/80 backdrop-blur border border-blue-500/40 hover:bg-blue-700/90 shadow-lg shadow-blue-500/30 text-white px-5 py-3 transition-all duration-300"
      >
        <Mail className="w-4 h-4" aria-hidden />
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            hover ? "opacity-100" : "opacity-0 md:opacity-100"
          }`}
        >
          Contact {shortLabel}
        </span>
      </a>
    </div>
  );
}
