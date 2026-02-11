"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import UserHeader from "@/components/userProfile/UserHeader";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-pr_dg text-pr_dg">
        <div className="w-full px-4 pb-0 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <div className="pt-[120px]">
            <UserHeader activeTab="profile" userName="Stephan Macroski" />

            <div className="mt-4 rounded-2xl bg-pr_w px-6 py-6">
              <h2 className="text-lg font-semibold">Profile details</h2>
              <p className="mt-1 text-sm text-pr_dg/60">
                Keep your information up to date
              </p>

              <form className="mt-6 grid gap-4 lg:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-semibold text-pr_dg">
                  Name
                  <input
                    type="text"
                    defaultValue="Stephan Macroski"
                    className="w-full rounded-full border border-pr_dg/30 px-4 py-3 text-sm text-pr_dg outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-pr_dg">
                  Email
                  <input
                    type="email"
                    defaultValue="stephan@evervale.com"
                    disabled
                    className="w-full cursor-not-allowed rounded-full border border-pr_dg/30 bg-pr_w/70 px-4 py-3 text-sm text-pr_dg/70 outline-none"
                  />
                </label>
              </form>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full bg-pr_dg px-6 py-3 text-sm font-semibold text-pr_w"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  className="rounded-full border border-pr_dg/40 px-6 py-3 text-sm font-semibold text-pr_dg"
                >
                  Change password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
