"use client";

import Image from "next/image";
import { useState } from "react";
import { getBrandLogoSrc } from "@/data/brandLogos";

type BrandLogoProps = {
  slug: string;
  name: string;
  className?: string;
};

const logoBoxClass =
  "relative mx-auto flex h-[72px] w-full max-w-[100px] items-center justify-center overflow-hidden rounded-xl border border-gray-100/80 bg-gradient-to-b from-white to-gray-50";

export default function BrandLogo({ slug, name, className = "" }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);
  const src = getBrandLogoSrc(slug);

  if (!src || failed) {
    return (
      <div className={`${logoBoxClass} ${className}`}>
        <span className="text-lg font-bold tracking-tight text-[#f75d34]">
          {name.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={`${logoBoxClass} ${className}`}>
      <Image
        src={src}
        alt={`${name} logo`}
        width={88}
        height={56}
        className="h-11 w-auto max-h-11 max-w-[80px] object-contain object-center"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
