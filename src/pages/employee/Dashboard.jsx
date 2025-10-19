import React, { useState, useEffect } from "react";
import {
  RiProjectorFill,
  RiCheckboxCircleFill,
  RiTimeFill,
  RiHandCoinFill,
  RiTrophyFill,
  RiHourglassFill,
  RiBarChartFill,
} from "react-icons/ri";
import { FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DashboardCard from "../../components/manager/DashboardCard";
import { getOngoingProjects, getPendingAssignments } from "../../api/employee/assignProject";
import { completedProject } from "../../api/employee/project"; // Keep this if you still need completed project count
import { getMyPayments } from "../../api/employee/payment";
import Toaster from "../../components/Toaster";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    pendingCount: 0,
    ongoingCount: 0,
    completedCount: 0, // This is completed PROJECT count, not payments
    totalEarned: 0, // Will be calculated from completed payments
    averageEarning: 0, // Will be calculated from completed payments
    pendingPaymentsAmount: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [pendingRes, ongoingRes, completedProjectData, paymentsRes] = await Promise.all([
        getPendingAssignments(),
        getOngoingProjects(),
        completedProject(), // Fetch completed project data (for count)
        getMyPayments(), // Fetch payments
      ]);

      // Extract data
      const pending = pendingRes.assignments || [];
      const ongoing = ongoingRes.projects || [];
      const completedProjectsSummary = completedProjectData.summary || {}; // For project count
      const payments = paymentsRes.data?.payments || [];

      // --- Calculation Updates ---
      // 1. Filter for completed payments
      const completedPayments = payments.filter(p => p.status === 'completed');

      // 2. Calculate total earned from completed payments
      const totalEarnedCompleted = completedPayments.reduce(
        (acc, payment) => acc + parseFloat(payment.amount || 0),
        0
      );

      // 3. Calculate average earning from completed payments
      const averageEarningCompleted = completedPayments.length > 0
        ? totalEarnedCompleted / completedPayments.length
        : 0;

      // Process pending payments amount (remains the same)
      const pendingPaymentsAmount = payments
        .filter(p => p.status === 'pending')
        .reduce((acc, payment) => acc + parseFloat(payment.amount || 0), 0);

      // 4. Update stats state with the new calculations
      setStats({
        pendingCount: pending.length,
        ongoingCount: ongoing.length,
        completedCount: completedProjectsSummary.totalCompleted || 0, // Keep using project count here
        totalEarned: totalEarnedCompleted, // Use calculated completed amount
        averageEarning: averageEarningCompleted, // Use calculated completed average
        pendingPaymentsAmount: pendingPaymentsAmount,
      });

      // Process data for the earnings chart (remains the same, uses completedPayments)
      const projectNames = completedPayments.map(p => p.project?.name || 'Unknown Project');
      const projectAmounts = completedPayments.map(p => parseFloat(p.amount || 0));

      setChartData({
        labels: projectNames,
        datasets: [
          {
            label: 'Project Earning (USD)',
            data: projectAmounts,
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      });

      // Recent projects (logic remains the same)
      // Note: `completedProjectData.projects` might be needed here if it exists
      const completedProjectsList = completedProjectData.projects || [];
      const recent = [...ongoing, ...completedProjectsList]
        .sort((a, b) => new Date(b.updatedAt || b.completedAt) - new Date(a.updatedAt || a.completedAt))
        .slice(0, 5);
      setRecentProjects(recent);

      // Upcoming deadlines (logic remains the same)
      const deadlines = [...pending, ...ongoing]
        .filter(p => p.project?.deadline)
        .sort((a, b) => new Date(a.project.deadline) - new Date(b.project.deadline))
        .slice(0, 5);
      setUpcomingDeadlines(deadlines);

    } catch (error) {
      setToast({ show: true, message: error.message || 'Failed to load dashboard', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- summaryCardData now correctly uses the calculated stats ---
  const summaryCardData = [
    {
      title: "Ongoing Projects",
      value: isLoading ? <Skeleton className="h-7 w-12" /> : stats.ongoingCount.toString(),
      subtitle: isLoading ? <Skeleton className="h-4 w-24" /> : "Currently working on",
      IconComponent: RiProjectorFill,
      iconColor: isLoading ? "text-gray-300" : "text-blue-400",
    },
    {
      title: "Completed Projects", // This title refers to project count
      value: isLoading ? <Skeleton className="h-7 w-12" /> : stats.completedCount.toString(),
      subtitle: isLoading ? <Skeleton className="h-4 w-28" /> : "Successfully finished",
      IconComponent: RiCheckboxCircleFill,
      iconColor: isLoading ? "text-gray-300" : "text-green-400",
    },
    {
      title: "Pending Requests",
      value: isLoading ? <Skeleton className="h-7 w-12" /> : stats.pendingCount.toString(),
      subtitle: isLoading ? <Skeleton className="h-4 w-28" /> : "Awaiting your response",
      IconComponent: RiTimeFill,
      iconColor: isLoading ? "text-gray-300" : "text-yellow-400",
    },
    {
      title: "Pending Payments",
      value: isLoading ? <Skeleton className="h-7 w-20" /> : `$${stats.pendingPaymentsAmount.toLocaleString()}`,
      subtitle: isLoading ? <Skeleton className="h-4 w-28" /> : "Total amount pending",
      IconComponent: RiHourglassFill,
      iconColor: isLoading ? "text-gray-300" : "text-purple-400",
    },
    {
      title: "Total Earning", // Uses calculated stats.totalEarned
      value: isLoading ? <Skeleton className="h-7 w-20" /> : `$${stats.totalEarned.toLocaleString()}`,
      subtitle: isLoading ? <Skeleton className="h-4 w-24" /> : "From completed payments", // Subtitle updated for clarity
      IconComponent: RiHandCoinFill,
      iconColor: isLoading ? "text-gray-300" : "text-cyan-400",
    },
    {
      title: "Average Earning", // Uses calculated stats.averageEarning
      value: isLoading ? <Skeleton className="h-7 w-20" /> : `$${stats.averageEarning.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, // Ensure 2 decimal places
      subtitle: isLoading ? <Skeleton className="h-4 w-24" /> : "Per completed payment", // Subtitle updated for clarity
      IconComponent: RiTrophyFill,
      iconColor: isLoading ? "text-gray-300" : "text-orange-400",
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#e5e7eb' } },
      title: { display: false },
      tooltip: {
        backgroundColor: '#1f2937', titleColor: '#e5e7eb', bodyColor: '#e5e7eb',
        callbacks: { label: (context) => ` Earning: $${context.parsed.y}` }
      }
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { ticks: { color: '#9ca3af', callback: (value) => `$${value}` }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': case 'verified': return 'text-green-400';
      case 'ongoing': case 'in_progress': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return null;
    const now = new Date();
    const deadline = new Date(dateString);
    const days = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <>
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Employee Dashboard</h2>
        <p className="text-gray-400">Welcome back! Here's your project overview</p>
      </div>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {summaryCardData.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      {/* --- EARNINGS CHART --- */}
      <div className="mb-6 bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <RiBarChartFill className="text-blue-400" />
          Earnings per Completed Project
        </h3>
        <div className="relative h-80">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (chartData && chartData.labels.length > 0) ? (
            <Bar options={chartOptions} data={chartData} />
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-400">
              <div>
                <FiAlertCircle className="mx-auto mb-3" size={40} />
                <p>No completed project earnings to display.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
           <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
             <RiProjectorFill className="text-blue-400" />
             Recent Projects
           </h3>
           {isLoading ? (
             <div className="space-y-3">
               {[...Array(3)].map((_, idx) => (
                 <div key={idx} className="bg-gray-700/50 rounded-lg p-4 animate-pulse">
                   <div className="h-5 bg-gray-600 rounded w-2/3 mb-3"></div>
                   <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                 </div>
               ))}
             </div>
           ) : recentProjects.length === 0 ? (
             <div className="text-center py-8 text-gray-400">
               <FiAlertCircle className="mx-auto mb-3" size={40} />
               <p>No recent projects</p>
             </div>
           ) : (
             <div className="space-y-3">
               {recentProjects.map((project, idx) => (
                 <div key={idx} className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-all border border-gray-600/30">
                   <div className="flex justify-between items-start mb-2">
                     <h4 className="text-white font-semibold">{project.project?.name || project.name || 'Unnamed Project'}</h4>
                     <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(project.workStatus)} bg-opacity-20`}>
                       {project.workStatus?.replace(/_/g, ' ') || 'N/A'}
                     </span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                     <span className="text-gray-400">Role: <span className="text-purple-300">{project.role || 'N/A'}</span></span>
                     {project.completedAt && (
                       <span className="text-gray-400">Completed: {formatDate(project.completedAt)}</span>
                     )}
                   </div>
                   {project.rating && (
                     <div className="mt-2 flex items-center gap-1">
                       <RiTrophyFill className="text-yellow-400" />
                       <span className="text-yellow-400 font-semibold">{project.rating}/5</span>
                     </div>
                   )}
                 </div>
               ))}
             </div>
           )}
         </div>

        {/* Upcoming Deadlines */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiClock className="text-yellow-400" />
            Upcoming Deadlines
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="bg-gray-700/50 rounded-lg p-3 animate-pulse">
                  <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : upcomingDeadlines.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiCheckCircle className="mx-auto mb-3" size={32} />
              <p className="text-sm">No upcoming deadlines</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((assignment, idx) => {
                const daysLeft = getDaysUntil(assignment.project?.deadline);
                const isUrgent = daysLeft !== null && daysLeft <= 3;
                return (
                  <div key={idx} className={`bg-gray-700/30 rounded-lg p-3 border ${isUrgent ? 'border-red-500/50' : 'border-gray-600/30'}`}>
                    <p className="text-white font-medium text-sm mb-1">{assignment.project?.name || 'Project'}</p>
                    <p className="text-xs text-gray-400 mb-2">{assignment.role || 'N/A'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{formatDate(assignment.project?.deadline)}</span>
                      {daysLeft !== null && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isUrgent ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                          {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Today!' : 'Overdue'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-md bg-gray-700 ${className}`} />
);

export default Dashboard;