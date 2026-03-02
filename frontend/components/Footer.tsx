import FooterColumn from "@/components/common/FooterColumn";
import Logo from "@/components/ui/Logo";

const footerColumns = [
  {
    title: "B2C",
    links: [
      { label: "Home", href: "/" },
      { label: "Seeds", href: "/products" },
      { label: "My Info", href: "/user_profile/profile" },
    ],
  },
  {
    title: "B2B",
    links: [
      { label: "Hero", href: "https://everlave-b2b.netlify.app/" },
      { label: "About Us", href: "https://everlave-b2b.netlify.app/" },
      { label: "Why We", href: "https://everlave-b2b.netlify.app/" },
      { label: "Our Suppliers", href: "https://everlave-b2b.netlify.app/" },
      { label: "Contact Us", href: "https://everlave-b2b.netlify.app/" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Privacy", href: "/privacy-policy" }],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-pr_w/30 bg-transparent">
      <div className="mx-auto flex w-full flex-col gap-10 px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <div className="flex w-full flex-col items-center gap-10 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
          <div className="flex flex-col items-center gap-6 lg:items-start">
            <Logo />
            <div className="text-pr_w/80">
              <p>+352 662 345 456</p>
              <p>contact@evervale.com</p>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14">
            {footerColumns.map((column) => (
              <FooterColumn
                key={column.title}
                title={column.title}
                links={column.links}
                className="min-w-[140px] text-center lg:text-left"
              />
            ))}
          </div>
        </div>

        <p className="text-sm flex justify-center mt-8 text-pr_w/60">
          ©2025 EVERVALE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
