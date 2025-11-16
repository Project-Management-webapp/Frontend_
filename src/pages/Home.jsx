import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiTrendingUp, FiClock, FiCheckCircle, FiBarChart, FiShield } from 'react-icons/fi';
import logo from '/login_logo.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-30">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-28 w-auto" />
            </div>
            <button
              onClick={() => navigate('/login')}
              className="btn"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ac51fc]/20 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-[#ac51fc] to-purple-400 bg-clip-text text-transparent">
              Project Management
              <br />
              Made Simple
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Streamline your workflow, collaborate seamlessly, and deliver projects on time with our comprehensive management platform.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn"
            >
              Start Your Journey →
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#ac51fc] to-purple-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-[#ac51fc]/50 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ac51fc] to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FiUsers size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Team Collaboration</h3>
              <p className="text-gray-300 text-sm">
                Seamlessly manage employees, assign tasks, and track team performance in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-[#ac51fc]/50 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ac51fc] to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FiBarChart size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Project Tracking</h3>
              <p className="text-gray-300 text-sm">
                Monitor project progress, milestones, and deadlines with intuitive dashboards and analytics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-[#ac51fc]/50 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ac51fc] to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FiClock size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Time Management</h3>
              <p className="text-gray-300 text-sm">
                Track work hours, allocate resources efficiently, and optimize team productivity.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-[#ac51fc]/50 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ac51fc] to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FiTrendingUp size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Financial Overview</h3>
              <p className="text-gray-300 text-sm">
                Manage budgets, track expenses, and analyze project profitability with comprehensive financial tools.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-[#ac51fc]/50 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ac51fc] to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FiCheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Task Management</h3>
              <p className="text-gray-300 text-sm">
                Create, assign, and prioritize tasks with ease. Keep everyone aligned and focused on deliverables.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-[#ac51fc]/50 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ac51fc] to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FiShield size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure & Reliable</h3>
              <p className="text-gray-300 text-sm">
                Enterprise-grade security with 2FA and Google Authenticator to protect your sensitive data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#ac51fc] to-purple-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ac51fc] to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Sign Up & Get Approved</h3>
              <p className="text-gray-300 text-sm">
                Managers register and await admin approval. Employees are added by managers. Quick and secure onboarding process.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ac51fc] to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Create & Assign Projects</h3>
              <p className="text-gray-300 text-sm">
                Managers create projects, set budgets, define milestones, and assign employees based on skills and availability.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ac51fc] to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Track & Deliver</h3>
              <p className="text-gray-300 text-sm">
                Monitor progress in real-time, manage payments, handle support tickets, and ensure successful project delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#ac51fc] to-purple-400 bg-clip-text text-transparent">
            Built For Everyone
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Admin */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Admin</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Approve manager registrations</li>
                <li>✓ Oversee all employees & managers</li>
                <li>✓ Monitor system-wide statistics</li>
                <li>✓ Manage pending approvals</li>
                <li>✓ Full system control & access</li>
              </ul>
            </div>

            {/* Manager */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Manager</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ Create & manage projects</li>
                <li>✓ Add and assign employees</li>
                <li>✓ Track financial metrics</li>
                <li>✓ Handle support tickets</li>
                <li>✓ Approve payment requests</li>
              </ul>
            </div>

            {/* Employee */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Employee</h3>
              <ul className="space-y-3 text-gray-300">
                <li>✓ View assigned projects</li>
                <li>✓ Track work progress</li>
                <li>✓ Request payments</li>
                <li>✓ Submit support tickets</li>
                <li>✓ Access project details & chat</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#ac51fc]/20 to-purple-600/20 rounded-3xl p-12 border border-[#ac51fc]/30">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join teams already using our platform to manage their projects efficiently.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 Manna. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
