import { useEffect, useState } from "react";

export function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll the result into view, flash its outline, then focus the result heading. */
export function revealResult(block: HTMLElement | null, heading: HTMLElement | null) {
  if (!block) return;
  block.scrollIntoView?.({
    behavior: reducedMotion() ? "instant" : "smooth",
    block: "start",
  });
  block.classList.remove("calc-result-highlight");
  if (!reducedMotion()) {
    void block.offsetWidth;
    block.classList.add("calc-result-highlight");
  }
  heading?.focus({ preventScroll: true });
}

/** True for two seconds after each call to `pulse`. */
export function useMomentaryFlag() {
  const [token, setToken] = useState(0);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (token === 0) return;
    setOn(true);
    const id = window.setTimeout(() => setOn(false), 2000);
    return () => window.clearTimeout(id);
  }, [token]);
  return [on, () => setToken((value) => value + 1)] as const;
}
