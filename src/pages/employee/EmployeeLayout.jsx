import React, { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../../components/employee/Sidebar"; // Assuming the path is correct
import LogoutModal from "../../components/modals/LogoutModal";
import Toaster from "../../components/Toaster";
import logo from "/login_logo.png";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Notification from "./Notification";
import OngoingProjects from "./projects/OngoingProjects";
import CompletedProjects from "./projects/CompletedProjects";
import SupportTickets from "./support-tickets/SupportTickets";
import CreateTicket from "./support-tickets/CreateTicket";
import Payments from "./payments/Payments";
import RequestPayment from "./payments/RequestPayment";

const EmployeeLayout = () => {
  // Initialize activeView from localStorage or default to "dashboard"
  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem("employeeActiveView") || "dashboard";
  });

  // Persist activeView to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("employeeActiveView", activeView);
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
      case "notification":
        return <Notification />;
      case "ongoingProjects":
        return <OngoingProjects />;
      case "completedProjects":
        return <CompletedProjects />;
      case "supportTickets":
        return <SupportTickets setActiveView={setActiveView} />;
      case "createTicket":
        return <CreateTicket setActiveView={setActiveView} />;
      case "payments":
        return <Payments setActiveView={setActiveView} />;
      case "requestPayment":
        return <RequestPayment setActiveView={setActiveView} />;
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
            <img src={logo} alt="Logo" className="w-26" />
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* The modal is called here with the correct role */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onShowToast={setToast}
        role="employee" // Pass the 'employee' role
      />

      {/* The toaster is rendered here, controlled by the layout */}
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

export default EmployeeLayout;