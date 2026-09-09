"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = ".reveal, .reveal-left, .reveal-right";

export function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );

    const observeAll = (root: ParentNode) => {
      root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => obs.observe(el));
    };

    // Initial pass for whatever's already on the page.
    observeAll(document);

    // Async content (React Query data, e.g. store cards, product grids,
    // reviews) mounts its own `.reveal` elements after this effect has
    // already run its one-time querySelectorAll — without watching for
    // DOM mutations those elements never get observed and stay stuck at
    // opacity:0 forever. Catch anything added after the initial pass.
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(REVEAL_SELECTOR)) obs.observe(node);
          observeAll(node);
        });
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      obs.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
