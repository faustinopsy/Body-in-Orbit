const DURATION = 420;
const ease = (t) => 1 - (1 - t) ** 3;
const mix = (from, to, t) => from.map((value, index) => value + (to[index] - value) * t);
const asText = (box) => box.map((value) => Math.round(value * 10) / 10).join(' ');

function prefersStill() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function createViewBoxAnimator(svg, initial) {
  let current = initial;
  let frame = null;

  function show(box) {
    current = box;
    svg.setAttribute('viewBox', asText(box));
  }

  function animateTo(target) {
    if (frame !== null) cancelAnimationFrame(frame);
    if (prefersStill() || typeof requestAnimationFrame !== 'function') return show(target);
    const from = current;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / DURATION);
      show(mix(from, target, ease(t)));
      frame = t < 1 ? requestAnimationFrame(step) : null;
    };
    frame = requestAnimationFrame(step);
  }

  return { animateTo };
}