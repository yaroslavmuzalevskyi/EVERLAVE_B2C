import AuthCard from "@/components/auth/AuthCard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pr_dg px-4 py-16 text-pr_dg">
      <AuthCard>{children}</AuthCard>
    </div>
  );
}
