import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgeGateModal from "@/components/AgeGateModal";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <AgeGateModal />
      <main className="pt-[96px] pb-[100px]">{children}</main>
      <Footer />
    </>
  );
}
