"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  dismissPromo,
  getPromoOffer,
  PROMO_CHANGED_EVENT,
  shouldShowPromo,
  type PromoOffer,
} from "@/lib/promoOffer";
import PromoCard from "./PromoCard";

/**
 * Site-wide offers/announcement popup. Content is controlled from the admin
 * panel (Promo & Offers). Hidden on admin routes and respects per-user dismissal.
 */
export default function PromoPopup() {
  const pathname = usePathname();
  const router = useRouter();
  const [offer, setOffer] = useState<PromoOffer | null>(null);
  const [visible, setVisible] = useState(false);

  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      setVisible(false);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    const evaluate = () => {
      const current = getPromoOffer();
      setOffer(current);
      if (shouldShowPromo(current)) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(
          () => setVisible(true),
          Math.max(0, current.delaySeconds) * 1000
        );
      } else {
        setVisible(false);
      }
    };

    evaluate();
    window.addEventListener(PROMO_CHANGED_EVENT, evaluate);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(PROMO_CHANGED_EVENT, evaluate);
    };
  }, [isAdmin, pathname]);

  const close = () => {
    if (offer) dismissPromo(offer);
    setVisible(false);
  };

  const handleCta = (e: React.MouseEvent) => {
    if (!offer) return;
    dismissPromo(offer);
    setVisible(false);
    if (offer.ctaHref && offer.ctaHref.startsWith("/")) {
      e.preventDefault();
      router.push(offer.ctaHref);
    }
  };

  if (isAdmin || !offer) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={offer.title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <PromoCard offer={offer} onClose={close} onCtaClick={handleCta} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
