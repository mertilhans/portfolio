import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // "#try" gibi bir capa varsa hedef bilesen kendisi kaydiriyor;
    // burada en uste atmak o kaydirmayi ezerdi.
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default ScrollToTop;
