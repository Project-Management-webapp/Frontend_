import React from "react";

const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    const configs = {
      low: {
        bg: "bg-blue-400/10",
        text: "text-blue-400",
        label: "Low",
      },
      medium: {
        bg: "bg-yellow-400/10",
        text: "text-yellow-400",
        label: "Medium",
      },
      high: {
        bg: "bg-orange-400/10",
        text: "text-orange-400",
        label: "High",
      },
      critical: {
        bg: "bg-red-400/10",
        text: "text-red-400",
        label: "Critical",
      },
    };
    return configs[priority?.toLowerCase()] || configs.medium;
  };

  const config = getPriorityConfig(priority);

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default PriorityBadge;
