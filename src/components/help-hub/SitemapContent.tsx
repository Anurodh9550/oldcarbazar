import Link from "next/link";
import { helpHubNavGroups, sitemapSections } from "@/data/helpHubPages";

export default function SitemapContent() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {sitemapSections.map((section) => (
        <section key={section.title}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">{section.title}</h2>
          <ul className="mt-3 space-y-2">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-medium text-gray-700 hover:text-[#f75d34]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {helpHubNavGroups.map((group) => (
        <section key={group.title}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">{group.title}</h2>
          <ul className="mt-3 space-y-2">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm font-medium text-gray-700 hover:text-[#f75d34]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
