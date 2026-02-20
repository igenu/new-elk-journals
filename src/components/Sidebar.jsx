import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { sidebarData } from "../data/sidebarData";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaKey,
} from "react-icons/fa";
import { getRole } from "../utils/secureStorage";

const Sidebar = ({ collapsed, setCollapsed, onOpenChangePassword }) => {
  const [openSubMenu, setOpenSubMenu] = useState({});
  const location = useLocation();
  const role = getRole();

  const toggleSubMenu = (index) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const filteredSidebarData = sidebarData.filter((item) => {
    return item?.access?.includes(role);
  });

  return (
    <div
      className={`bg-[#204066] text-white ${collapsed ? "w-20" : "w-72"} min-h-screen flex flex-col transition-all duration-300 shadow-xl relative`}
    >
      {/* Brand Header */}
      <div className="relative">
        <Link
          to="/dashboard"
          className={`flex items-center ${collapsed ? "justify-center px-2" : "px-6"} py-5 bg-[#1a3654] border-b border-[#2c4a6e] hover:bg-[#162e4a] transition-colors`}
        >
          <div
            className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#12b48b] to-[#0e9470] flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {role?.charAt(0)?.toUpperCase() || "P"}
              </span>
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-white capitalize tracking-wide">
                  {role} Panel
                </h1>
                <p className="text-xs text-[#8ba4c4] font-medium">Dashboard</p>
              </div>
            )}
          </div>
        </Link>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-[#12b48b] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0e9470] transition-colors z-[99]"
        >
          {collapsed ? (
            <FaChevronRight className="text-white text-xs" />
          ) : (
            <FaChevronLeft className="text-white text-xs" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-widest text-[#8ba4c4] font-semibold px-3 mb-3">
            Navigation
          </p>
        )}
        <ul className="space-y-1">
          {filteredSidebarData?.length > 0 &&
            filteredSidebarData?.map((item, index) => {
              const isActive = location.pathname === item.path;
              const hasSubNav = item.subNav && item.subNav.length > 0;
              const isOpen = openSubMenu[index];

              return (
                <li key={index}>
                  {hasSubNav ? (
                    <div
                      className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-3 py-3 cursor-pointer rounded-xl transition-all duration-200
                                            ${
                                              isActive
                                                ? "bg-gradient-to-r from-[#12b48b] to-[#0e9470] text-white shadow-lg shadow-[#12b48b]/20"
                                                : "text-[#b8c9dc] hover:bg-[#2c4a6e] hover:text-white"
                                            }`}
                      onClick={() => toggleSubMenu(index)}
                      title={collapsed ? item.title : ""}
                    >
                      <div
                        className={`flex items-center ${collapsed ? "" : "gap-3"}`}
                      >
                        {item.icon && (
                          <item.icon
                            className={`text-lg ${collapsed ? "" : ""} ${isActive ? "text-white" : "text-[#12b48b]"}`}
                          />
                        )}
                        {!collapsed && (
                          <span className="font-medium text-sm">
                            {item.title}
                          </span>
                        )}
                      </div>
                      {!collapsed && hasSubNav && (
                        <div
                          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        >
                          <FaChevronDown className="text-xs" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center ${collapsed ? "justify-center" : ""} px-3 py-3 rounded-xl transition-all duration-200
                                            ${
                                              isActive
                                                ? "bg-gradient-to-r from-[#12b48b] to-[#0e9470] text-white shadow-lg shadow-[#12b48b]/20"
                                                : "text-[#b8c9dc] hover:bg-[#2c4a6e] hover:text-white"
                                            }`}
                      title={collapsed ? item.title : ""}
                    >
                      <div
                        className={`flex items-center ${collapsed ? "" : "gap-3"}`}
                      >
                        {item.icon && (
                          <item.icon
                            className={`text-lg ${isActive ? "text-white" : "text-[#12b48b]"}`}
                          />
                        )}
                        {!collapsed && (
                          <span className="font-medium text-sm">
                            {item.title}
                          </span>
                        )}
                      </div>
                    </Link>
                  )}

                  {/* Submenu */}
                  {hasSubNav && isOpen && !collapsed && (
                    <ul className="mt-1 ml-4 pl-4 border-l-2 border-[#2c4a6e] space-y-1">
                      {item?.subNav?.length > 0 &&
                        item.subNav.map((subItem, subIndex) => {
                          const isSubActive =
                            location.pathname === subItem.path;
                          return (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                                                            ${
                                                              isSubActive
                                                                ? "bg-[#2c4a6e] text-[#12b48b] font-medium"
                                                                : "text-[#8ba4c4] hover:text-white hover:bg-[#2c4a6e]/50"
                                                            }`}
                              >
                                {subItem.icon && (
                                  <subItem.icon className="text-sm" />
                                )}
                                <span>{subItem.title}</span>
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </li>
              );
            })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[#2c4a6e] space-y-3">
          <button
            onClick={onOpenChangePassword}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#2c4a6e] to-[#1a3654] rounded-xl hover:from-[#12b48b]/20 hover:to-[#0e9470]/20 text-[#12b48b] font-medium text-sm transition-all duration-200 border border-[#12b48b]/30 hover:border-[#12b48b]/60"
          >
            <FaKey className="text-sm" />
            <span>Change Password</span>
          </button>
          <div className="bg-gradient-to-r from-[#2c4a6e] to-[#1a3654] rounded-xl p-4">
            <p className="text-xs text-[#8ba4c4] mb-1">Logged in as</p>
            <p className="text-sm font-semibold text-white capitalize">
              {role}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
