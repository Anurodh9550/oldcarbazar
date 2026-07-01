"use client";

import Image from "next/image";
import Link from "next/link";
import { useChromeCopy, useLanguage } from "@/context/LanguageContext";

function FooterLinkList({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-gray-600 transition hover:text-[#f75d34]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  const { t } = useLanguage();
  const copy = useChromeCopy();
  const year = new Date().getFullYear();
  const f = copy.footer;

  const highlights = [
    { icon: "🏆", title: f.highlight1Title, subtitle: f.highlight1Sub },
    { icon: "✨", title: f.highlight2Title, subtitle: f.highlight2Sub },
    { icon: "🏷", title: f.highlight3Title, subtitle: f.highlight3Sub },
    { icon: "⚖", title: f.highlight4Title, subtitle: f.highlight4Sub },
  ];

  const aboutLinks = [
    { label: f.about, href: "/about" },
    { label: f.careers, href: "/careers" },
    { label: f.terms, href: "/help/terms" },
    { label: f.privacy, href: "/help/privacy" },
    { label: f.policies, href: "/help/policies" },
    { label: f.investors, href: "/investors" },
    { label: f.faqs, href: "/help/faq" },
  ];

  const connectLinks = [
    { label: f.feedback, href: "/feedback" },
    { label: f.contact, href: "/contact" },
    { label: f.advertise, href: "/advertise" },
    { label: f.partner, href: "/partner" },
    { label: f.admin, href: "/admin/login" },
  ];

  const otherLinks = [
    { label: f.usedCars, href: "/used-cars" },
    { label: f.browseDealers, href: "/dealers" },
    { label: f.valuation, href: "/valuation" },
    { label: f.rcGuide, href: "/rc-guide" },
    { label: f.insurance, href: "/insurance" },
    { label: f.reviews, href: "/reviews" },
    { label: f.news, href: "/news" },
  ];

  const social = [
    { label: "Facebook", href: "https://facebook.com", icon: "f" },
    { label: "X", href: "https://x.com", icon: "𝕏" },
    { label: "YouTube", href: "https://youtube.com", icon: "▶" },
    { label: "Instagram", href: "https://instagram.com", icon: "◎" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
  ];

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="border-b border-gray-100">
        <ul className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:py-10">
          {highlights.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xl"
                aria-hidden
              >
                {item.icon}
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">{item.title}</p>
                <p className="text-caption mt-0.5">{item.subtitle}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterLinkList title={f.aboutTitle} links={aboutLinks} />
          <FooterLinkList title={f.connectTitle} links={connectLinks} />
          <FooterLinkList title={f.exploreTitle} links={otherLinks} />

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              {f.experienceTitle}
            </h3>
            <p className="text-body-muted mt-4 text-sm">{f.experienceDesc}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://apps.apple.com/in/app/old-car-bazar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-800 hover:border-[#f75d34]"
              >
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.oldcarbazar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-800 hover:border-[#f75d34]"
              >
                Google Play
              </a>
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-gray-900">
              {f.followUs}
            </p>
            <div className="mt-3 flex gap-2">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-xs font-bold text-gray-600 hover:border-[#f75d34] hover:text-[#f75d34]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
          <Link href="/" className="flex items-center">
            <Image
              src="/logocarr-trans.png"
              alt="Old Car Bazar"
              width={160}
              height={44}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <p className="text-caption text-center sm:text-right">
            {t(f.copyright, { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
