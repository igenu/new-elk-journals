import { useState, useEffect } from "react";
import {
  FaSignOutAlt,
  FaKey,
  FaSpinner,
  FaHome,
  FaBars,
  FaBell,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { authApi } from "../services/api";
import { getRole } from "../utils/secureStorage";
import { Switch, message } from "antd";

const Header = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  isChangePasswordOpen,
  setIsChangePasswordOpen,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  useEffect(() => {
    if (isChangePasswordOpen) {
      setIsResetPasswordOpen(true);
    }
  }, [isChangePasswordOpen]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const storedTrigger = localStorage.getItem("email_trigger");
  const initialUser = user ? JSON.parse(user) : null;
  const initialTrigger = storedTrigger ? JSON.parse(storedTrigger) : null;
  const role = getRole();
  const [userProfile, setUserProfile] = useState(initialUser);
  const [emailTriggerEnabled, setEmailTriggerEnabled] = useState(
    initialTrigger ??
      !!(initialUser?.email_trigger ?? initialUser?.emailTrigger),
  );
  const [isEmailTriggerLoading, setIsEmailTriggerLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    if (role === "author" || role === "editor") {
      navigate("/login");
    } else {
      navigate("/admin/login");
    }
  };

  const handleEmailTriggerToggle = async (checked) => {
    if (!userProfile?.id || !role) {
      message.error("User details not available");
      return;
    }

    const previousValue = emailTriggerEnabled;
    setEmailTriggerEnabled(checked);
    setIsEmailTriggerLoading(true);

    try {
      const response = await authApi.updateEmailTrigger({
        role,
        id: userProfile.id,
        email_trigger: checked ? 1 : 0,
      });

      const updatedUser = response.data?.user || {};
      const responseEmailTrigger =
        response.data?.email_trigger ?? updatedUser.email_trigger;
      const normalizedUser = {
        ...userProfile,
        ...updatedUser,
        email_trigger:
          typeof responseEmailTrigger === "boolean"
            ? responseEmailTrigger
            : !!(responseEmailTrigger ?? checked),
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem(
        "email_trigger",
        JSON.stringify(!!normalizedUser.email_trigger),
      );
      setUserProfile(normalizedUser);
      setEmailTriggerEnabled(!!normalizedUser.email_trigger);
      message.success(response.data?.message || "Email trigger updated");
    } catch (error) {
      setEmailTriggerEnabled(previousValue);
      message.error(
        error.response?.data?.message || "Failed to update email trigger",
      );
    } finally {
      setIsEmailTriggerLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    const newErrors = {};
    if (!currentPassword)
      newErrors.currentPassword = "Current password is required";
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });

      setIsResetPasswordOpen(false);
      setIsChangePasswordOpen?.(false);
      setCurrentPassword("");
      setNewPassword("");

      Swal.fire({
        title: "Success!",
        text: "Password changed successfully",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-[#12b48b] text-white px-6 py-2 rounded",
        },
      });
    } catch (error) {
      console.error(error);
      setGeneralError(
        error.response?.data?.message || "Failed to change password",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}`.toUpperCase();
    }
    if (userProfile?.firstName) {
      return userProfile.firstName.charAt(0).toUpperCase();
    }
    return role?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <header className="bg-white h-16 flex items-center justify-between px-6 border-b border-gray-200 sticky top-0 z-20">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <FaBars className="text-lg" />
        </button>

        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#204066] hover:bg-[#204066]/5 transition-all duration-200 group"
        >
          <FaHome className="text-lg group-hover:text-[#12b48b] transition-colors" />
          <span className="font-medium text-sm hidden sm:inline">
            Back to Website
          </span>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 shadow-sm">
          <span className="text-xs font-semibold text-gray-700">
            Email Alerts
          </span>
          <Switch
            size="small"
            checked={emailTriggerEnabled}
            loading={isEmailTriggerLoading}
            onChange={handleEmailTriggerToggle}
          />
        </div>

        {/* Notification Bell */}
        {/* <button className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                    <FaBell className="text-lg" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#12b48b] rounded-full"></span>
                </button> */}

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        {/* User Profile Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#204066] to-[#2c4a6e] flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-semibold">
                {getUserInitials()}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 m-0 p-0 h-5 flex items-center">
                {userProfile?.firstName || "Admin"}
              </p>
              <p className="text-xs text-gray-500 capitalize m-0 p-0 h-4 flex items-center">
                {role}
              </p>
            </div>
            <FaChevronDown
              className={`text-gray-400 text-xs hidden sm:block transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <p className="text-sm font-semibold text-gray-800">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {role} Account
                </p>
              </div>

              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Email Alerts
                    </p>
                    <p className="text-xs text-gray-500">
                      Turn notification emails on or off
                    </p>
                  </div>
                  <Switch
                    size="small"
                    checked={emailTriggerEnabled}
                    loading={isEmailTriggerLoading}
                    onChange={handleEmailTriggerToggle}
                  />
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <FaSignOutAlt className="text-gray-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Password Modal */}
      {isResetPasswordOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-[420px] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#204066] to-[#2c4a6e] px-6 py-5">
              <h2 className="text-xl font-bold text-white">Change Password</h2>
              <p className="text-sm text-[#8ba4c4] mt-1">
                Update your account password
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (errors.currentPassword)
                      setErrors({ ...errors, currentPassword: "" });
                  }}
                  className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-[#12b48b] transition-all ${errors.currentPassword ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                  placeholder="Enter current password"
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword)
                      setErrors({ ...errors, newPassword: "" });
                  }}
                  className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-[#12b48b] transition-all ${errors.newPassword ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                  placeholder="Minimum 6 characters"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {generalError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                  <span className="font-medium">{generalError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetPasswordOpen(false);
                    setIsChangePasswordOpen?.(false);
                    setErrors({});
                    setGeneralError("");
                    setCurrentPassword("");
                    setNewPassword("");
                  }}
                  className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 rounded-xl transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-[#12b48b] to-[#0e9470] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#12b48b]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading && <FaSpinner className="animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
