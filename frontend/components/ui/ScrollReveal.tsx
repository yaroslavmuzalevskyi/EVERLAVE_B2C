"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TARGET_SELECTOR = [
  "main section",
  "main article",
  "main aside",
  "main h1",
  "main h2",
  "main h3",
  "main h4",
  "main h5",
  "main h6",
  "main p",
  "main li",
  "main button",
  "main img",
  "main form",
  "main ul",
  "main ol",
  "main blockquote",
].join(", ");

function isRevealCandidate(element: HTMLElement): boolean {
  if (element.closest("svg")) return false;
  if (element.dataset.noReveal === "true") return false;
  if (element.closest("[data-no-reveal='true']")) return false;
  if (element.closest("[data-filter-root]")) return false;

  const className =
    typeof element.className === "string" ? element.className : "";
  if (
    className.includes("opacity-0") ||
    className.includes("scale-") ||
    className.includes("pointer-events-none")
  ) {
    return false;
  }

  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden") return false;

  return !(element.clientWidth === 0 && element.clientHeight === 0);
}

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (reducedMotion || isMobile) return;

    let sequence = 0;
    const processed = new WeakSet<HTMLElement>();
    const revealObserver =
      !reducedMotion && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries, observer) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue;

                const target = entry.target as HTMLElement;
                target.classList.add("scroll-reveal-visible");
                observer.unobserve(target);
              }
            },
            {
              threshold: 0.12,
              rootMargin: "0px 0px -10% 0px",
            },
          )
        : null;

    const registerElement = (element: HTMLElement) => {
      if (processed.has(element) || !isRevealCandidate(element)) return;

      processed.add(element);
      element.classList.add("scroll-reveal-hidden");
      element.style.setProperty(
        "--scroll-reveal-delay",
        `${Math.min((sequence % 8) * 45, 315)}ms`,
      );
      sequence += 1;

      if (!revealObserver) {
        element.classList.add("scroll-reveal-visible");
        return;
      }

      revealObserver.observe(element);
    };

    const scan = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(TARGET_SELECTOR)) {
        registerElement(root);
      }

      const elements = root.querySelectorAll<HTMLElement>(TARGET_SELECTOR);
      for (const element of elements) {
        registerElement(element);
      }
    };

    const frame = window.requestAnimationFrame(() => {
      scan(main);
    });

    const failSafeTimer = window.setTimeout(() => {
      main
        .querySelectorAll<HTMLElement>(".scroll-reveal-hidden")
        .forEach((element) => {
          element.classList.add("scroll-reveal-visible");
        });
    }, 1800);

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (!(addedNode instanceof HTMLElement)) continue;
          scan(addedNode);
        }
      }
    });
    mutationObserver.observe(main, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(failSafeTimer);
      mutationObserver.disconnect();
      revealObserver?.disconnect();
    };
  }, [pathname]);

  return null;
}
