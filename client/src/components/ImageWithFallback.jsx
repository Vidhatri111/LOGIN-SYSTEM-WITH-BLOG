import { useState } from "react";

const FALLBACK_IMAGE = "/writing-desk.svg";

export default function ImageWithFallback({ src, alt = "", ...props }) {
  const [failedSrc, setFailedSrc] = useState("");
  const imageSrc = src && failedSrc !== src ? src : FALLBACK_IMAGE;

  return (
    <img
      {...props}
      src={imageSrc}
      alt={alt}
      onError={() => {
        if (imageSrc !== FALLBACK_IMAGE) setFailedSrc(src);
      }}
    />
  );
}
