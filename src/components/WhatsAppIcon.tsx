import Image from "next/image";

export const WHATSAPP_ICON_SRC = "/greenwhatsappicon.svg";

type WhatsAppIconProps = {
  size?: number;
  className?: string;
  alt?: string;
  "aria-hidden"?: boolean;
};

export default function WhatsAppIcon({
  size = 20,
  className = "",
  alt = "WhatsApp",
  "aria-hidden": ariaHidden,
}: WhatsAppIconProps) {
  return (
    <Image
      src={WHATSAPP_ICON_SRC}
      alt={ariaHidden ? "" : alt}
      width={size}
      height={size}
      aria-hidden={ariaHidden}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
