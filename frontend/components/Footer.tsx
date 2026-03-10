import FooterColumn from "@/components/common/FooterColumn";
import Logo from "@/components/ui/Logo";

const footerColumns = [
  {
    title: "SHOP",
    links: [
      { label: "Home", href: "/" },
      { label: "Seeds", href: "/seeds" },
      { label: "My Account", href: "/user_profile/profile" },
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
    <footer className="w-full border-t border-pr_w/30 bg-transparent">
      <div className="mx-auto flex w-full flex-col gap-10 px-6 py-12 sm:px-8 md:px-8 lg:px-12 xl:px-[130px]">
        <div className="flex w-full flex-col items-center gap-10 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
          <div className="flex flex-col items-center gap-6 lg:items-start">
            <Logo />
            <div className="text-pr_w/80">
              <p>+352 662 345 456</p>
              <p>contact@evervale.org</p>
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
