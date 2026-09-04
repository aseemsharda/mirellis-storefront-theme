import Image from "next/image";

export function MirellisBrand() {
  return (
    <span className="mirellis-brand-lockup" aria-hidden="true">
      <Image
        className="mirellis-brand-lockup__symbol"
        src="/brand/mirellis-symbol-gold.png"
        width={512}
        height={512}
        alt=""
      />
      <Image
        className="mirellis-brand-lockup__wordmark"
        src="/brand/mirellis-wordmark-gold.png"
        width={1024}
        height={130}
        alt=""
      />
    </span>
  );
}
