"use client";

import Image from "next/image";
import { useState } from "react";
import { resolveListingImageUrl } from "@/lib/listingImages";

type ListingImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
};

/** Renders uploaded base64 photos and remote URLs. */
export default function ListingImage({
  src,
  alt,
  fill,
  className = "",
  sizes,
  width,
  height,
}: ListingImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = failed ? resolveListingImageUrl(undefined) : resolveListingImageUrl(src);

  if (src.startsWith("data:")) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover ${className}`}
        />
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
