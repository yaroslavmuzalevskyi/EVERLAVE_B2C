import Image from "next/image";
import FooterColumn from "@/components/common/FooterColumn";
import Logo from "@/components/ui/Logo";
import facebook from "@/public/icons/facebook-logo.svg";
import twitter from "@/public/icons/twitter-logo.svg";
import linkedin from "@/public/icons/linkedin-logo.svg";
import instagram from "@/public/icons/instagram-logo.svg";

const socials = [
  { label: "Facebook", icon: facebook, href: "" },
  { label: "Twitter", icon: twitter, href: "" },
  {
    label: "Instagram",
    icon: instagram,
    href: "https://www.instagram.com/evervale_official?igsh=MXY2YjB1aHd6emJlaQ%3D%3D",
  },
  {
    label: "LinkedIn",
    icon: linkedin,
    href: "https://www.linkedin.com/company/evervale/",
  },
];

const footerColumns = [
  {
    title: "SHOP",
    links: [
      { label: "Home", href: "https://evervale.org/" },
      { label: "Seeds", href: "https://evervale.org/products" },
      {
        label: "My Account",
        href: "https://evervale.org/signin?next=/user_profile/profile",
      },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About Us", href: "https://b2b.evervale.org/#about" },
      { label: "Why Us", href: "https://b2b.evervale.org/#why" },
      { label: "Contact Us", href: "https://b2b.evervale.org/#contact" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "Help/FAQ", href: "/" },
      { label: "Shipping & Returns", href: "/" },
      { label: "Community", href: "/" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Return & Refund Policy", href: "/return-refund-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-pr_w/30 bg-pr_dg">
      <div className="mx-auto flex w-full flex-col gap-10 px-6 py-12 sm:px-8 md:px-8 lg:px-12 xl:px-[130px]">
        <div className="flex w-full flex-col items-center gap-10 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
          <div className="flex flex-col items-center gap-6 lg:items-start">
            <Logo />
            <div className="text-pr_w/80">
              <p>+357 978 162 42</p>
              <p>info@evervale.org</p>
            </div>
            <div className="flex gap-6 justify-center lg:justify-start">
              {socials
                .filter((s) => s.href)
                .map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex h-6 w-6 items-center justify-center"
                    aria-label={social.label}
                  >
                    <Image
                      src={social.icon}
                      alt={social.label}
                      width={20}
                      height={20}
                      className="h-6 w-6 filter brightness-0 invert"
                    />
                  </a>
                ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:ml-auto lg:flex lg:w-auto lg:max-w-none lg:items-start lg:justify-end lg:gap-4 xl:gap-6">
            {footerColumns.map((column) => (
              <FooterColumn
                key={column.title}
                title={column.title}
                links={column.links}
                className={`w-full items-center text-center lg:items-start lg:text-left ${
                  column.title === "LEGAL" ? "lg:w-auto" : "lg:w-[180px]"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-1 text-center text-sm text-pr_w/60">
          <p>©2026 EVERVALE. All rights reserved.</p>
          <p>
            Sold strictly as collectible or souvenir seeds. Not intended for
            illegal use where prohibited by law.
          </p>
        </div>
      </div>
    </footer>
  );
}
