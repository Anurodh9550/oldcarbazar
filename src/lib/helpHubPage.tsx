import Header from "@/components/Header";
import HelpHubShell from "@/components/help-hub/HelpHubShell";
import { helpPageConfig, type HelpPageConfig } from "@/data/helpHubPages";
import type { Metadata } from "next";

type HelpHubPageProps = {
  path: keyof typeof helpPageConfig;
  children: React.ReactNode;
};

export function buildHelpHubMetadata(path: keyof typeof helpPageConfig): Metadata {
  const meta = helpPageConfig[path];
  return {
    title: `${meta.title} | Old Car Bazar`,
    description: meta.description,
  };
}

export function HelpHubPage({ path, children }: HelpHubPageProps) {
  const meta: HelpPageConfig = helpPageConfig[path];

  return (
    <>
      <Header />
      <HelpHubShell
        badge={meta.badge}
        title={meta.title}
        subtitle={meta.subtitle}
        backHref={meta.backHref}
        backLabel={meta.backLabel}
        showLanguageToggle={meta.showLanguageToggle}
        badgeHi={meta.badgeHi}
        titleHi={meta.titleHi}
        subtitleHi={meta.subtitleHi}
      >
        {children}
      </HelpHubShell>
    </>
  );
}
