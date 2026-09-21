import { useEffect, useRef, useState } from 'react';

/**
 * Cycles through phrases with a type-on / hold / erase rhythm.
 * Pauses entirely when the user prefers reduced motion.
 */
export function useTypewriter(phrases, { type = 55, erase = 26, hold = 1500 } = {}) {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('typing');
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced.current) {
      setText(phrases[0] || '');
      return undefined;
    }

    const current = phrases[index % phrases.length];
    let timer;

    if (phase === 'typing') {
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), type);
      } else {
        timer = setTimeout(() => setPhase('holding'), hold);
      }
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('erasing'), 220);
    } else if (phase === 'erasing') {
      if (text.length > 0) {
        timer = setTimeout(() => setText(current.slice(0, text.length - 1)), erase);
      } else {
        setIndex((i) => (i + 1) % phrases.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timer);
  }, [text, phase, index, phrases, type, erase, hold]);

  return text;
}

/**
 * Reveals an element when it scrolls into view.
 *
 * Deliberately fails open: `inView` starts true, and is only flipped false if
 * the element is genuinely below the fold at mount. That means the content is
 * correct even if IntersectionObserver never fires, is unsupported, or the
 * page is rasterised without a real compositor. The enhancement is the
 * animation; the information is never hidden behind it.
 */
export function useInView({ threshold = 0.15 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    // Only hide (so it can animate in) when it really is off-screen.
    if (node.getBoundingClientRect().top > window.innerHeight) {
      setInView(false);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/** Tracks whether a media query currently matches. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
