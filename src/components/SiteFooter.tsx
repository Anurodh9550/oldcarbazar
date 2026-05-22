import Image from "next/image";
import Link from "next/link";
import {
  footerAboutLinks,
  footerConnectLinks,
  footerHighlights,
  footerOtherLinks,
  footerSocial,
} from "@/data/footer";

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
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      {/* Highlights */}
      <div className="border-b border-gray-100">
        <ul className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:py-10">
          {footerHighlights.map((item) => (
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

      {/* Link columns */}
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterLinkList title="About Old Car Bazar" links={footerAboutLinks} />
          <FooterLinkList title="Connect With Us" links={footerConnectLinks} />
          <FooterLinkList title="Explore" links={footerOtherLinks} />

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Experience Old Car Bazar
            </h3>
            <p className="text-body-muted mt-4 text-sm">
              Buy & sell used cars with direct owner contact, free listings, and city-wise search
              across India.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-900 px-3 py-2 text-xs font-semibold text-white">
                <span aria-hidden>🍎</span> App Store
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-900 px-3 py-2 text-xs font-semibold text-white">
                <span aria-hidden>▶</span> Google Play
              </span>
            </div>
            <Link href="/used-cars" className="mt-5 inline-flex items-center gap-2">
              <Image
                src="/logocar.png"
                alt="Old Car Bazar"
                width={120}
                height={36}
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6">
          <p className="text-caption text-center sm:text-left">
            © {year} Old Car Bazar. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-caption font-medium text-gray-500">Connect:</span>
            <ul className="flex items-center gap-2">
              {footerSocial.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700 transition hover:bg-[#f75d34] hover:text-white"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
