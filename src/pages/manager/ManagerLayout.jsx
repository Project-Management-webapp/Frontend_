import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../../components/manager/Sidebar";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import logo from "/login_logo.png";
import LogoutModal from "../../components/modals/LogoutModal";
import Notification from "./Notification";
import Toaster from "../../components/Toaster";
import AllEmployee from "./AllEmployee";

import AllProjects from "./project/AllProjects";
import SupportTickets from "./support-tickets/SupportTickets";
import Payments from "./payments/Payments";
// import Chat from "./projects/chat/index";

import FinanceOverview from "./finance/FinanceOverview";
import ProfitLoss from "./finance/ProfitLoss";
import IncomeSummary from "./finance/IncomeSummary";
import EmployeeAllocations from "./finance/EmployeeAllocations";
import ResourceComparison from "./finance/ResourceComparison";
import CompletedProjects from "./project/CompletedProjects";

const AssignEmployee = () => <div className="text-white text-2xl">Assign Employee Page</div>;
const Workload = () => <div className="text-white text-2xl">Workload & Tasks Page</div>;
const Performance = () => <div className="text-white text-2xl">Performance Reviews Page</div>;

const ManagerLayout = () => {
  // Initialize activeView from localStorage or default to "dashboard"
  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem("managerActiveView") || "dashboard";
  });

  useEffect(() => {
    localStorage.setItem("managerActiveView", activeView);
  }, [activeView]);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "profile":
        return <Profile />;
      case "notifications":
        return <Notification />;
      case "employees-all":
        return <AllEmployee />;
      case "employees-assign":
        return <AssignEmployee />;
      case "employees-workload":
        return <Workload />;
      case "employees-performance":
        return <Performance />;
      case "active_projects":
        return <AllProjects />;
      case "completed_projects":
        return <CompletedProjects />;
      case "supportTickets":
        return <SupportTickets setActiveView={setActiveView} />;
      case "payments":
        return <Payments />;
      case "finance-overview":
        return <FinanceOverview />;
      case "finance-profit-loss":
        return <ProfitLoss />;
      case "finance-income":
        return <IncomeSummary />;
      case "finance-allocations":
        return <EmployeeAllocations />;
      case "finance-resource-comparison":
        return <ResourceComparison />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-slate-900">

        <div
          className={`fixed inset-y-0 left-0 z-30 transform ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative ${isDesktopSidebarCollapsed ? "lg:w-20" : "lg:w-64"
            } transition-width duration-200 ease-in-out`}
        >
          <Sidebar
            isMobile={window.innerWidth < 1024}
            onClose={() => setMobileSidebarOpen(false)}
            isCollapsed={isDesktopSidebarCollapsed}
            onCollapse={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
            activeView={activeView}
            setActiveView={setActiveView}
            onLogoutRequest={() => setLogoutModalOpen(true)}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between bg-white/10 backdrop-blur-md px-4 py-3 border-b border-white/20 lg:hidden">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <FiMenu className="text-2xl" />
            </button>
            <img src={logo} alt="Logo" className="w-28" />
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onShowToast={setToast}
        role="manager"
      />
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}

          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
};

export default ManagerLayout;