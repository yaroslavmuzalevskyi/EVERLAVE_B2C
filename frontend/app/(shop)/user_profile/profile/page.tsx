"use client";

import { useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import UserHeader from "@/components/userProfile/UserHeader";
import { useAuth } from "@/components/auth/AuthProvider";
import Modal from "@/components/ui/Modal";
import {
  getStoredProfileEmail,
  getStoredProfileName,
  setStoredProfileName,
} from "@/lib/userProfile";
import { updateMyName, updateMyPassword } from "@/services/users";

const DEFAULT_NAME = "Stephan Macroski";
const DEFAULT_EMAIL = "stephan@evervale.com";

export default function ProfilePage() {
  const { logout } = useAuth();
  const [name, setName] = useState(
    () => getStoredProfileName() || DEFAULT_NAME,
  );
  const [email] = useState(() => getStoredProfileEmail() || DEFAULT_EMAIL);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [nameSuccess, setNameSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const openPasswordModal = () => {
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    if (passwordLoading) return;
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordModalOpen(false);
  };

  const handleNameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNameError("");
    setNameSuccess("");

    try {
      setNameLoading(true);
      const result = await updateMyName(name);
      const updatedName = result.name.trim() || name.trim();
      setName(updatedName);
      setStoredProfileName(updatedName);
      setNameSuccess("Name updated successfully.");
    } catch (error) {
      setNameError(
        error instanceof Error ? error.message : "Failed to update name",
      );
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);
      await updateMyPassword(currentPassword, newPassword);
      await logout();
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Failed to update password",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-pr_dg text-pr_dg">
        <div className="w-full px-4 pb-0 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <div className="pt-[120px]">
            <UserHeader activeTab="profile" userName={name || DEFAULT_NAME} />

            <div className="mt-4 rounded-2xl bg-pr_w px-6 py-6">
              <h2 className="text-lg font-semibold">Profile details</h2>
              <p className="mt-1 text-sm text-pr_dg/60">
                Keep your information up to date
              </p>

              <form
                onSubmit={handleNameSubmit}
                className="mt-6 grid gap-4 lg:grid-cols-2"
              >
                <label className="flex flex-col gap-2 text-sm font-semibold text-pr_dg">
                  Name
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-full border border-pr_dg/30 px-4 py-3 text-sm text-pr_dg outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-pr_dg">
                  Email
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded-full border border-pr_dg/30 bg-pr_w/70 px-4 py-3 text-sm text-pr_dg/70 outline-none"
                  />
                </label>

                <div className="lg:col-span-2">
                  {nameError ? (
                    <p className="text-xs text-pr_dr">{nameError}</p>
                  ) : null}
                  {nameSuccess ? (
                    <p className="text-xs text-pr_dg/70">{nameSuccess}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={nameLoading}
                      className="rounded-full bg-pr_dg px-6 py-3 text-sm font-semibold text-pr_w disabled:opacity-60"
                    >
                      {nameLoading ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      type="button"
                      onClick={openPasswordModal}
                      className="rounded-full border border-pr_dg/40 px-6 py-3 text-sm font-semibold text-pr_dg"
                    >
                      Change password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        className="max-w-3xl"
      >
        <div>
          <h3 className="text-xl font-semibold text-pr_dg">Change password</h3>
          <p className="mt-1 text-sm text-pr_dg/60">
            For security, you will be asked to sign in again.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-pr_dg">
            Current password
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-full border border-pr_dg/30 px-4 py-3 text-sm text-pr_dg outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-pr_dg">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-full border border-pr_dg/30 px-4 py-3 text-sm text-pr_dg outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-pr_dg">
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-full border border-pr_dg/30 px-4 py-3 text-sm text-pr_dg outline-none"
            />
          </label>

          {passwordError ? (
            <p className="text-xs text-pr_dr">{passwordError}</p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={closePasswordModal}
              disabled={passwordLoading}
              className="rounded-full border border-pr_dg/30 px-5 py-2 text-sm font-semibold text-pr_dg disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={passwordLoading}
              className="rounded-full bg-pr_dg px-5 py-2 text-sm font-semibold text-pr_w disabled:opacity-60"
            >
              {passwordLoading ? "Updating..." : "Change password"}
            </button>
          </div>
        </form>
      </Modal>
    </RequireAuth>
  );
}
