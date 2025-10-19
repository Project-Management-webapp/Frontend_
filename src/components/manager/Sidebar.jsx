import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiFolder,
  FiUsers,
  FiCheckSquare,
  FiBarChart2,
  FiFileText,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiUser,
  FiLogOut,
  FiDollarSign
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
  onLogoutRequest
}) => {
  const handleItemClick = (view) => {
    setActiveView(view);
    if (isMobile) {
      onClose();
    }
  };
  const handleSubItemClick = (path) => {
    console.log(`Navigating to ${path}`);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <div
      className={`h-screen bg-white/10 backdrop-blur-md text-white flex flex-col border-r border-white/20 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20 shrink-0">
        <div className="flex items-center overflow-hidden">
          <img
            src={isCollapsed ? logo : logo}
            alt="Logo"
            className={`transition-all duration-300 ease-in-out ${isCollapsed ? "w-0" : "w-36"}`}
          />
        </div>
        {!isMobile && (
          <button
            onClick={onCollapse}
            className="text-gray-400 hover:text-white p-2 transition-colors rounded-lg"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
        )}
        {isMobile && (
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2" aria-label="Close sidebar">
            <FiX size={20} />
          </button>
        )}
      </div>


      <nav className={`flex-1 px-2 py-4 space-y-2 ${isCollapsed ? 'overflow-x-hidden' : 'overflow-y-auto'}`}>
        <SidebarItem
          icon={<FiHome size={20} />}
          text="Dashboard"
          collapsed={isCollapsed}
          active={activeView === 'dashboard'}
          onClick={() => handleItemClick('dashboard')}
        />
        <SidebarGroup
          icon={<FiFolder size={20} />}
          text="Projects"
          collapsed={isCollapsed}
          onSubItemClick={handleItemClick}
          items={[
            { text: "All Projects", view: "projects" },
            { text: "Completed Projects", view: "completedProject" },
          ]}
        />
        <SidebarGroup
          icon={<FiUsers size={20} />}
          text="Employees"
          collapsed={isCollapsed}
          onSubItemClick={handleItemClick}
          items={[

            { text: "All Employees", view: "employees-all" },
             {text:"Pending Apporvals",view:"approvals"}
          ]}
        />
        {/* <SidebarItem
          icon={<FiCheckSquare size={20} />}
          text="Tasks"
          collapsed={isCollapsed}
          active={activeView === 'tasks'}
          onClick={() => handleItemClick('tasks')}
        /> */}
        <SidebarGroup
          icon={<FiBarChart2 size={20} />}
          text="Finance"
          collapsed={isCollapsed}
          onSubItemClick={handleSubItemClick}
          items={[
            { text: "Project Budgets", path: "/finance/budgets" },
            { text: "Profit & Loss", path: "/finance/pnl" },
            { text: "Income Summary", path: "/finance/summary" },
          ]}
        />
        <SidebarItem
          icon={<RiCustomerService2Line size={20} />}
          text="Support Tickets"
          collapsed={isCollapsed}
          active={activeView === 'supportTickets'}
          onClick={() => handleItemClick('supportTickets')}
        />
        <SidebarItem
          icon={<FiDollarSign size={20} />}
          text="Payments"
          collapsed={isCollapsed}
          active={activeView === 'payments'}
          onClick={() => handleItemClick('payments')}
        />
        <SidebarGroup
          icon={<FiFileText size={20} />}
          text="Reports"
          collapsed={isCollapsed}
          onSubItemClick={handleSubItemClick}
          items={[
            { text: "Project Progress", path: "/reports/projects" },
            { text: "Task Reports", path: "/reports/tasks" },
            { text: "Financial Reports", path: "/reports/finance" },
          ]}
        />
        {/* <SidebarItem
          icon={<FiMessageSquare size={20} />}
          text="Messages"
          collapsed={isCollapsed}
          active={activeView === 'messages'}
          onClick={() => handleItemClick('messages')}
        /> */}
        <SidebarItem
          icon={<IoMdNotificationsOutline size={20} />}
          text="Notifications"
          collapsed={isCollapsed}
          active={activeView === 'notifications'}
          onClick={() => handleItemClick('notifications')}
        />
      </nav>
      <div className="p-4 space-y-2 border-t border-white/20 shrink-0">
        <SidebarItem
          icon={<FiUser size={20} />}
          text="Profile"
          collapsed={isCollapsed}
          active={activeView === 'profile'}
          onClick={() => handleItemClick('profile')}
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
      className={`w-full flex items-center p-3 rounded-lg transition-colors ${active ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="ml-3 text-sm font-medium">{text}</span>}
    </button>
    {collapsed && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        {text}
      </div>
    )}
  </div>
);

const SidebarGroup = ({ icon, text, items, collapsed, onSubItemClick }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (collapsed) {
      setOpen(false);
    }
  }, [collapsed]);

  return (
    <div className="relative group">
      <button
        onClick={() => !collapsed && setOpen(!open)}
        className="w-full flex items-center justify-between p-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
      >
        <div className="flex items-center overflow-hidden">
          <div className="shrink-0">{icon}</div>
          <span className={`ml-3 text-sm font-medium overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}>
            {text}
          </span>
        </div>
        {!collapsed && (
          <FiChevronRight className={`transform transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
        )}
      </button>

      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {text}
        </div>
      )}

      {!collapsed && open && (
        <div className="ml-4 pl-4 border-l border-white/10 mt-1 space-y-1">
          {items.map((item, index) => (
            <button
              key={item.view || item.path || index}
              onClick={() => onSubItemClick(item.view || item.path)}
              className="w-full text-left p-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors truncate"
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