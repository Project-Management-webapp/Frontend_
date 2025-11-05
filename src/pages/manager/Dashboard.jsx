import React, { useState, useEffect } from "react";
import {
  RiProjectorFill,
  RiTeamFill,
  RiCheckboxCircleFill,
  RiHandCoinFill,
  RiMoneyDollarCircleFill,
  RiLineChartFill,
} from "react-icons/ri";
import { FiAlertCircle, FiUsers } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardCard from "../../components/manager/cards/DashboardCard";
import { getAllProject } from "../../api/manager/project";
import { getAllEmployees } from "../../api/manager/employeedetail";
import { getAllPayments } from "../../api/manager/payment";
import Toaster from "../../components/Toaster";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalEmployees: 0,
    completedProjects: 0,
    totalBudget: 0,
    totalAllocated: 0,
    totalActualAmount: 0,
    totalPaidAmount: 0,
  });
  const [teamWorkload, setTeamWorkload] = useState([]);
  const [projectFinancials, setProjectFinancials] = useState([]); // Added for new chart
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data
      const [projectsRes, employeesRes, paymentsRes] = await Promise.all([
        getAllProject(),
        getAllEmployees(),
        getAllPayments(),
      ]);

      const allProjects = projectsRes?.data?.projects?.rows || [];

      // Extract employees
      let employees = [];
      if (Array.isArray(employeesRes)) {
        employees = employeesRes;
      } else if (Array.isArray(employeesRes?.data)) {
        employees = employeesRes.data;
      } else if (Array.isArray(employeesRes?.employees)) {
        employees = employeesRes.employees;
      } else if (Array.isArray(employeesRes?.data?.employees)) {
        employees = employeesRes.data.employees;
      } else if (employeesRes?.data?.employees?.rows && Array.isArray(employeesRes.data.employees.rows)) {
        employees = employeesRes.data.employees.rows;
      }

      // Extract payments and calculate total paid amount
      const allPayments = paymentsRes?.data?.payments?.rows || [];
      const totalPaidAmountCalc = allPayments.reduce((acc, payment) => {
        // Only count payments that are completed/paid
        if (payment.requestStatus === 'paid' && payment.status === 'completed') {
          return acc + (parseFloat(payment.amount) || 0);
        }
        return acc;
      }, 0);

      const activeCount = allProjects.filter(p =>
        ['in_progress', 'planning', 'review'].includes(p.status?.toLowerCase())
      ).length;
      const completedCount = allProjects.filter(p =>
        p.status?.toLowerCase() === 'completed'
      ).length;

      const totalBudgetCalc = allProjects.reduce((acc, project) => {
        return acc + (parseFloat(project.budget) || 0);
      }, 0);

      const totalAllocatedCalc = allProjects.reduce((acc, project) => {
        return acc + (parseFloat(project.allocatedAmount) || 0);
      }, 0);

      // Calculate total actual amount (actualHours * rate + actualConsumables + actualMaterials)
      const totalActualAmountCalc = allProjects.reduce((acc, project) => {
        const actualHours = parseFloat(project.actualHours) || 0;
        const rate = parseFloat(project.rate) || 0;
        const actualConsumables = parseFloat(project.actualConsumables) || 0;
        const actualMaterials = parseFloat(project.actualMaterials) || 0;
        const actualAmount = (actualHours * rate) + actualConsumables + actualMaterials;
        return acc + actualAmount;
      }, 0);

      // --- Calculate Project Financials for chart ---
      const financialsData = allProjects.map(project => {
        const budget = parseFloat(project.budget) || 0;
        const allocated = parseFloat(project.allocatedAmount) || 0;
        const actualHours = parseFloat(project.actualHours) || 0;
        const rate = parseFloat(project.rate) || 0;
        const actualConsumables = parseFloat(project.actualConsumables) || 0;
        const actualMaterials = parseFloat(project.actualMaterials) || 0;
        const actualAmount = (actualHours * rate) + actualConsumables + actualMaterials;
        const profit = budget - actualAmount;
        return {
          name: project.name, // Use project name for X-axis
          budget,
          allocated,
          actualAmount,
          profit,
        };
      });
      setProjectFinancials(financialsData); // Set state for new chart

      setStats({
        totalProjects: allProjects.length,
        activeProjects: activeCount,
        totalEmployees: employees.length,
        completedProjects: completedCount,
        totalBudget: totalBudgetCalc,
        totalAllocated: totalAllocatedCalc,
        totalActualAmount: totalActualAmountCalc,
        totalPaidAmount: totalPaidAmountCalc,
      });

      // Calculate team workload from actual project assignments
      const employeeWorkload = {};
      
      // Initialize workload for all employees
      employees.forEach(emp => {
        employeeWorkload[emp.id] = {
          name: emp.fullName || emp.email.split('@')[0],
          projects: 0,
          assignments: 0,
        };
      });

      // Count actual assignments per employee from projects
      allProjects.forEach(project => {
        if (project.assignments && Array.isArray(project.assignments)) {
          project.assignments.forEach(assignment => {
            if (assignment.employeeId && employeeWorkload[assignment.employeeId]) {
              if (assignment.isActive) {
                employeeWorkload[assignment.employeeId].projects += 1;
                employeeWorkload[assignment.employeeId].assignments += 1;
              }
            }
          });
        }
      });

      // Convert to array and sort by workload, take top 5
      const workloadData = Object.values(employeeWorkload)
        .filter(emp => emp.projects > 0 || emp.assignments > 0) // Only show employees with work
        .sort((a, b) => (b.projects + b.assignments) - (a.projects + a.assignments))
        .slice(0, 5)
        .map(emp => ({
          name: emp.name,
          projects: emp.projects,
          assignments: emp.assignments,
        }));

      // If no workload data, show top 5 employees with 0 workload
      if (workloadData.length === 0) {
        const defaultWorkload = employees.slice(0, 5).map(emp => ({
          name: emp.fullName || emp.email.split('@')[0],
          projects: 0,
          assignments: 0,
        }));
        setTeamWorkload(defaultWorkload);
      } else {
        setTeamWorkload(workloadData);
      }

      // Recent activity
      const activity = allProjects
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 6)
        .map(p => ({
          project: p.name,
          status: p.status,
          date: p.updatedAt || p.createdAt,
        }));
      setRecentActivity(activity);

    } catch (error) {
      console.error('Dashboard error:', error);
      setToast({ show: true, message: error.message || 'Failed to load dashboard', type: 'error' });
      // Ensure stats remain valid even on error
      setStats(prev => ({
        ...prev,
        totalProjects: prev.totalProjects || 0,
        activeProjects: prev.activeProjects || 0,
        totalEmployees: prev.totalEmployees || 0,
        completedProjects: prev.completedProjects || 0,
        totalBudget: prev.totalBudget || 0,
        totalAllocated: prev.totalAllocated || 0,
        totalActualAmount: prev.totalActualAmount || 0,
        totalPaidAmount: prev.totalPaidAmount || 0,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return '#10B981';
      case 'in_progress': case 'ongoing': return '#3B82F6';
      case 'planning': return '#8B5CF6';
      case 'review': return '#F59E0B';
      case 'on_hold': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Pre-calculate derived stats for cards
  const totalProjects = stats.totalProjects || 0;
  const completedProjects = stats.completedProjects || 0;
  const completionPercentage = totalProjects > 0
    ? Math.round((completedProjects / totalProjects) * 100)
    : 0;

  const totalBudget = stats.totalBudget || 0;
  const totalAllocated = stats.totalAllocated || 0;
  const totalActualAmount = stats.totalActualAmount || 0;
  const totalPaidAmount = stats.totalPaidAmount || 0;
  const totalProfit = totalBudget - totalActualAmount;
  const paidPercentage = totalBudget > 0
    ? Math.round((totalPaidAmount / totalBudget) * 100)
    : 0;

  const cardData = [
    {
      title: 'Total Projects',
      value: isLoading ? (
        <Skeleton className="h-7 w-12" />
      ) : (
        totalProjects.toString()
      ),
      
      IconComponent: RiProjectorFill,
      iconColor: isLoading ? 'text-gray-300' : 'text-blue-400',
    },
    {
      title: 'Total Employees',
      value: isLoading
        ? <Skeleton className="h-7 w-12" />
        : (stats.totalEmployees || 0).toString(),
      subtitle: isLoading
        ? <Skeleton className="h-4 w-20" />
        : 'In your team',
      IconComponent: RiTeamFill,
      iconColor: isLoading ? 'text-gray-300' : 'text-purple-400',
    },
    {
      title: 'Completed Projects',
      value: isLoading
        ? <Skeleton className="h-7 w-12" />
        : completedProjects.toString(),
      subtitle: isLoading
        ? <Skeleton className="h-4 w-28" />
        : `${completionPercentage}% completion rate`,
      IconComponent: RiCheckboxCircleFill,
      iconColor: isLoading ? 'text-gray-300' : 'text-green-400',
    },
    {
      title: 'Total Budget',
      value: isLoading
        ? <Skeleton className="h-7 w-20" />
        : `$${totalBudget.toLocaleString()}`,
      subtitle: isLoading
        ? <Skeleton className="h-4 w-24" />
        : 'All projects',
      IconComponent: RiMoneyDollarCircleFill,
      iconColor: isLoading ? 'text-gray-300' : 'text-yellow-400',
    },
    {
      title: 'Total Paid',
      value: isLoading
        ? <Skeleton className="h-7 w-20" />
        : `$${totalPaidAmount.toLocaleString()}`,
      subtitle: isLoading
        ? <Skeleton className="h-4 w-28" />
        : `${paidPercentage}% of budget paid`,
      IconComponent: RiHandCoinFill,
      iconColor: isLoading ? 'text-gray-300' : 'text-orange-400',
    },
    {
      title: 'Est. Profit',
      value: isLoading
        ? <Skeleton className="h-7 w-20" />
        : `$${totalProfit.toLocaleString()}`,
      subtitle: isLoading
        ? <Skeleton className="h-4 w-28" />
        : '',
      IconComponent: RiLineChartFill,
      iconColor: isLoading ? 'text-gray-300' : 'text-cyan-400',
    },
  ];

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
        <h2 className="text-3xl font-bold text-white mb-2">Manager Dashboard</h2>
        <p className="text-gray-400">Comprehensive overview of your team and projects</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {cardData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            IconComponent={card.IconComponent}
            iconColor={card.iconColor}
          />
        ))}
      </div>

      {/* --- NEW: Project Financials Chart --- */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-7 border border-gray-700 mb-8">
  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
    <RiLineChartFill className="text-cyan-400" />
    Project Financials (Budget vs. Actual Amount)
  </h3>
  {isLoading ? (
    <div className="h-80 flex items-center justify-center">
       <Skeleton className="h-full w-full" />
    </div>
  ) : (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart 
        data={projectFinancials} 
        margin={{ top: 5, right: 20, bottom: 50, left: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="name"
          stroke="#9CA3AF"
          angle={-30} 
          textAnchor="end"
          height={70} 
          interval={0} 
        />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#fff' }}
          formatter={(value) => `$${value.toLocaleString()}`} 
        />
        <Legend />
        <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
        <Bar dataKey="actualAmount" fill="#F59E0B" name="Actual Amount" />
        <Bar dataKey="profit" fill="#10B981" name="Est. Profit" />
      </BarChart>
    </ResponsiveContainer>
  )}
</div>
      


      {/* Chart & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Team Workload - Bar Chart */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiUsers className="text-green-400" />
            Team Workload
          </h3>
          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamWorkload}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="projects" fill="#8B5CF6" name="Projects" />
                <Bar dataKey="assignments" fill="#10B981" name="Assignments" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <RiCheckboxCircleFill className="text-blue-400" />
            Recent Activity
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="bg-gray-700/50 rounded-lg p-3 animate-pulse">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FiAlertCircle className="mx-auto mb-3" size={40} />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0`} style={{ backgroundColor: getStatusColor(activity.status) }}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{activity.project}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Status: <span className="capitalize">{activity.status?.replace(/_/g, ' ')}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{formatDate(activity.date)}</span>
                </div>
              ))}
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