import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiFolder,
  FiUsers,
  FiCheckSquare,
  FiBarChart2,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUser,
  FiLogOut,
  FiDollarSign,
} from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiCustomerService2Line } from "react-icons/ri";
import logo from "/login_logo.png";

const Sidebar = ({
  isMobile,
  onClose,
  isCollapsed,
  onCollapse,
  activeView,
  setActiveView,
  onLogoutRequest,
}) => {
  const handleItemClick = (view) => {
    setActiveView(view);
    if (isMobile) onClose();
  };

  const handleSubItemClick = (view) => {
    setActiveView(view);
    if (isMobile) onClose();
  };

  return (
    <div
      className={`h-screen bg-white/10 backdrop-blur-md text-white flex flex-col border-r border-white/20 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20 shrink-0">
        <div className="flex items-center overflow-hidden">
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 ease-in-out ${
              isCollapsed ? "w-8" : "w-36"
            }`}
          />
        </div>
        {!isMobile && (
          <button
            onClick={onCollapse}
            className="text-gray-400 hover:text-white p-2 transition-colors rounded-lg"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <FiChevronRight size={20} />
            ) : (
              <FiChevronLeft size={20} />
            )}
          </button>
        )}
        {isMobile && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
        <SidebarItem
          icon={<FiHome size={20} />}
          text="Dashboard"
          collapsed={isCollapsed}
          active={activeView === "dashboard"}
          onClick={() => handleItemClick("dashboard")}
        />

        <SidebarGroup
          icon={<FiFolder size={20} />}
          text="My Projects"
          collapsed={isCollapsed}
          activeView={activeView}
          onSubItemClick={handleSubItemClick}
          items={[
            { text: "Ongoing Projects", view: "ongoingProjects" },
            { text: "Requested Projects", view: "requestProjects" },
            { text: "Completed Projects", view: "completedProjects" },
            { text: "Rejected Projects", view: "rejectedProjects" },
          ]}
        />

        {/* <SidebarItem
          icon={<FiCheckSquare size={20} />}
          text="My Tasks"
          collapsed={isCollapsed}
          active={activeView === "my-tasks"}
          onClick={() => handleItemClick("my-tasks")}
        /> */}

        {/* <SidebarGroup
          icon={<FiUsers size={20} />}
          text="Team"
          collapsed={isCollapsed}
          activeView={activeView}
          onSubItemClick={handleSubItemClick}
          items={[
            { text: "View Teammates", view: "teamView" },
            { text: "Roles & Responsibilities", view: "teamRoles" },
          ]}
        /> */}

        <SidebarGroup
          icon={<RiCustomerService2Line size={20} />}
          text="Support Tickets"
          collapsed={isCollapsed}
          activeView={activeView}
          onSubItemClick={handleSubItemClick}
          items={[
            { text: "My Tickets", view: "supportTickets" },
            { text: "Create Ticket", view: "createTicket" },
          ]}
        />

        <SidebarGroup
          icon={<FiDollarSign size={20} />}
          text="Payments"
          collapsed={isCollapsed}
          activeView={activeView}
          onSubItemClick={handleSubItemClick}
          items={[
            { text: "My Payments", view: "payments" },
            { text: "Request Payment", view: "requestPayment" },
          ]}
        />

        {/* <SidebarGroup
          icon={<FiBarChart2 size={20} />}
          text="My Earnings"
          collapsed={isCollapsed}
          activeView={activeView}
          onSubItemClick={handleSubItemClick}
          items={[
            { text: "Project Earnings", view: "earnings" },
            { text: "Payment History", view: "earningsHistory" },
          ]}
        /> */}

     

        <SidebarItem
          icon={<IoMdNotificationsOutline size={20} />}
          text="Notifications"
          collapsed={isCollapsed}
          active={activeView === "notification"}
          onClick={() => handleItemClick("notification")}
        />
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-2 border-t border-white/20 shrink-0">
        <SidebarItem
          icon={<FiUser size={20} />}
          text="Profile"
          collapsed={isCollapsed}
          active={activeView === "profile"}
          onClick={() => handleItemClick("profile")}
        />
        <SidebarItem
          icon={<FiLogOut size={20} />}
          text="Logout"
          collapsed={isCollapsed}
          onClick={onLogoutRequest}
        />
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, collapsed, active, onClick }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-lg transition-colors ${
        active
          ? "bg-white/20 text-white"
          : "text-gray-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="ml-3 text-sm font-medium">{text}</span>}
    </button>

    {collapsed && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {text}
      </div>
    )}
  </div>
);

const SidebarGroup = ({
  icon,
  text,
  items,
  collapsed,
  activeView,
  onSubItemClick,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (collapsed) setOpen(false);
  }, [collapsed]);

  return (
    <div>
      <button
        onClick={() => !collapsed && setOpen(!open)}
        className="w-full flex items-center justify-between p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
      >
        <div className="flex items-center overflow-hidden">
          <div className="shrink-0">{icon}</div>
          <span
            className={`ml-3 text-sm font-medium overflow-hidden whitespace-nowrap transition-all duration-300 ${
              collapsed ? "w-0 opacity-0" : "w-full opacity-100"
            }`}
          >
            {text}
          </span>
        </div>
        <div
          className={`transition-opacity duration-300 ${
            collapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          <FiChevronRight
            className={`transform transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          />
        </div>
      </button>

      {!collapsed && open && (
        <div className="ml-4 pl-4 border-l border-white/10 mt-1 space-y-1">
          {items.map((item) => (
            <button
              key={item.view}
              onClick={() => onSubItemClick(item.view)}
              className={`w-full text-left p-2 rounded-lg text-sm transition-colors truncate ${
                activeView === item.view
                  ? "bg-white/20 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
