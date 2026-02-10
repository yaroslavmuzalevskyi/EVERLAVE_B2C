"use client";

import Link from "next/link";

type AuthLinkRowProps = {
  text: string;
  linkText: string;
  href: string;
};

export default function AuthLinkRow({ text, linkText, href }: AuthLinkRowProps) {
  return (
    <p className="text-center text-xs text-pr_dg/70">
      {text}{" "}
      <Link href={href} className="font-semibold text-pr_dg">
        {linkText}
      </Link>
    </p>
  );
}
