"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_GMAIL_URL,
  CONTACT_OUTLOOK_URL,
} from "@/lib/contact";

const OPTIONS: { label: string; hint: string; href: string; blank: boolean }[] = [
  {
    label: "Default mail app",
    hint: "Outlook, Apple Mail, Thunderbird",
    href: CONTACT_MAILTO,
    blank: false,
  },
  { label: "Gmail", hint: "mail.google.com", href: CONTACT_GMAIL_URL, blank: true },
  {
    label: "Outlook / Hotmail",
    hint: "outlook.live.com",
    href: CONTACT_OUTLOOK_URL,
    blank: true,
  },
];

/**
 * Hosts the webmail options land on. Gmail and Outlook both boot a full SPA on
 * arrival, and none of that can start until DNS + TLS + TCP to these origins
 * has completed — on a cold connection that is dead time before their app even
 * begins downloading. Warming the sockets on intent (hover, or the chooser
 * opening) moves that cost off the critical path.
 *
 * gstatic serves Gmail's own JS/CSS bundle, so it is on the boot path too.
 */
const PRECONNECT_ORIGINS = [
  "https://mail.google.com",
  "https://www.gstatic.com",
  "https://outlook.live.com",
];

let warmed = false;

/** Idempotent across every ContactLink instance and every open. */
function warmConnections() {
  if (warmed || typeof document === "undefined") return;
  warmed = true;
  for (const href of PRECONNECT_ORIGINS) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }
}

/**
 * A contact link that opens a chooser instead of firing `mailto:` blindly.
 *
 * The anchor keeps `mailto:` as its real href so middle-click, "copy link
 * address", and assistive tech all behave. Only an unmodified left-click is
 * intercepted — modified clicks (new tab/window) fall through untouched.
 */
export default function ContactLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);

  // Freeze Lenis while the chooser owns the screen, and hand scroll back on
  // close or unmount — same contract the mobile menu uses.
  useEffect(() => {
    if (!open) return;
    const lenis = window.__lenis;
    // Only hand scroll back if we were the one who took it — the mobile menu
    // may already have Lenis stopped, and it owns that lock until it closes.
    const wasRunning = !lenis?.isStopped;
    lenis?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    // Move focus into the panel so keyboard users land on the options.
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      if (wasRunning) window.__lenis?.start();
    };
  }, [open]);

  // Returning focus to the trigger belongs on close, not on the open effect's
  // cleanup — otherwise an unmount would yank focus to a detached node.
  const close = () => {
    setOpen(false);
    setCopied(false);
    triggerRef.current?.focus();
  };

  const onTriggerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    warmConnections();
    setOpen(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <a
        ref={triggerRef}
        href={CONTACT_MAILTO}
        onClick={onTriggerClick}
        // Hover/focus is the earliest reliable signal of intent — it buys the
        // handshake a head start over opening the panel and reading it.
        onPointerEnter={warmConnections}
        onFocus={warmConnections}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={className}
      >
        {children}
      </a>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-20"
            role="dialog"
            aria-modal="true"
            aria-label="Choose how to email Brivix"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute inset-0 w-full h-full cursor-default bg-black/40 backdrop-blur-[2px]"
            />

            <div
              ref={panelRef}
              className="relative w-full max-w-[min(92vw,calc(420*var(--px)))] bg-grey border border-black/60 px-25 py-22 shadow-[0_calc(20*var(--px))_calc(60*var(--px))_rgba(0,0,0,0.25)]"
            >
              <div className="flex items-start justify-between gap-20 border-b border-dashed border-black/60 pb-10">
                <div>
                  <span className="_9 font-mono uppercase block">Email us</span>
                  <span className="_20 block mt-6">{CONTACT_EMAIL}</span>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="_9 font-mono uppercase shrink-0 pt-2 opacity-60 hover:opacity-100 active:opacity-100 transition-opacity"
                  style={{ transitionTimingFunction: "var(--smooth)" }}
                >
                  Close
                </button>
              </div>

              <div className="flex flex-col mt-14">
                {OPTIONS.map((opt) => (
                  <a
                    key={opt.label}
                    href={opt.href}
                    onClick={close}
                    {...(opt.blank
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group flex items-baseline justify-between gap-16 py-11 border-b border-dashed border-black/25 last:border-b-0"
                  >
                    <span className="_20">{opt.label}</span>
                    <span className="_9 font-mono uppercase opacity-45 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                      {opt.hint}
                    </span>
                  </a>
                ))}
              </div>

              <button
                type="button"
                onClick={copy}
                className="_9 font-mono uppercase mt-14 pt-11 w-full text-left border-t border-dashed border-black/60 opacity-60 hover:opacity-100 active:opacity-100 transition-opacity"
                style={{ transitionTimingFunction: "var(--smooth)" }}
              >
                {copied ? "Copied to clipboard" : "Copy address instead"}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
