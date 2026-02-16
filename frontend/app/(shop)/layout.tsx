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
      <main className="pb-6 lg:pb-20">{children}</main>
      <Footer />
    </>
  );
}
