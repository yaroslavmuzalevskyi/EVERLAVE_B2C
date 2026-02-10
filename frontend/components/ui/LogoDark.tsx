import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/logo_dark.svg"
        alt="Evervale"
        width={128}
        height={128}
        priority
      />
    </Link>
  );
}
