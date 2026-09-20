import { demoCards } from "./data";
import { assetPath } from "./seo";
import { CardImage } from "./shared";

export default function ScannerVisual({
  alt,
  className = "",
  eager = false,
}: {
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <div
      className={`scanner-composite ${className}`.trim()}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <img
        className="scanner-base"
        src={assetPath("/marketing/app/scanner.webp")}
        width="603"
        height="1311"
        alt=""
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
      />
      <div className="scan-camera-scene" aria-hidden="true">
        <div className="scan-camera-backdrop">
          <CardImage card={demoCards[1]} small decorative />
        </div>
        <div className="scan-card-focus">
          <CardImage card={demoCards[1]} eager={eager} decorative />
        </div>
        <i className="scan-light-beam" />
      </div>
      <i className="scan-placement-guide" aria-hidden="true" />
    </div>
  );
}
