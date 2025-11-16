import React from "react";
import TwoFactorToggle from "../../components/TwoFactorToggle/TwoFactorToggle";
import GoogleAuthToggle from "../../components/GoogleAuthToggle/GoogleAuthToggle";
import Toaster from "../../components/Toaster";

const Settings = ({ setActiveView }) => {
  const [toast, setToast] = React.useState({
    show: false,
    message: "",
    type: "",
  });
  const [is2FAEnabled, setIs2FAEnabled] = React.useState(false);
  const [isGoogleAuthEnabled, setIsGoogleAuthEnabled] = React.useState(false);

  return (
    <div className="text-white space-y-8">

      {/* Page Title */}
      <div>
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-[#ac51fc] to-purple-400 bg-clip-text text-transparent drop-shadow-md">
          Settings
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          Customize your account security preferences.
        </p>
      </div>

      {/* Settings Card */}
      <div className="
        bg-white/10 
        backdrop-blur-xl 
        rounded-2xl 
        p-8 
        border 
        border-white/20 
        shadow-xl 
        relative
       
      ">
        {/* Gradient Glow Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ac51fc]/20 via-purple-500/10 to-blue-500/20 blur-2xl opacity-40 pointer-events-none" />

        <h3 className="text-2xl font-bold mb-3">
          <span className="bg-gradient-to-r from-[#ac51fc] to-purple-400 bg-clip-text text-transparent">
            Security Settings
          </span>
        </h3>

        <p className="text-gray-400 mb-6 text-sm">
          Manage 2FA and Google Authenticator to keep your account secure.
        </p>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
          <p className="text-blue-300 text-sm">
         <strong>Note:</strong> You can only enable one authentication method at a time. 
            If you enable Google Authenticator, 2FA will be automatically disabled, and vice versa.
          </p>
        </div>

        <div className="space-y-8">
          <TwoFactorToggle
            onToast={(message, type) => setToast({ show: true, message, type })}
            disabled={isGoogleAuthEnabled}
            onStatusChange={setIs2FAEnabled}
          />
          <div className="border-t border-white/10" />
          <GoogleAuthToggle
            onToast={(message, type) => setToast({ show: true, message, type })}
            disabled={is2FAEnabled}
            onStatusChange={setIsGoogleAuthEnabled}
          />
        </div>
      </div>

      {/* Toast */}
      <Toaster
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Settings;
