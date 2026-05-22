import Image from "next/image";
import { getCityLogoSrc } from "@/data/cityLogos";

type CityLogoProps = {
  cityName: string;
  size?: number;
  className?: string;
};

export default function CityLogo({ cityName, size = 64, className = "" }: CityLogoProps) {
  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-full shadow-sm ring-1 ring-gray-100 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={getCityLogoSrc(cityName)}
        alt={`${cityName} logo`}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </span>
  );
}
