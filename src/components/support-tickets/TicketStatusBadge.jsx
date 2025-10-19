import React from "react";

const TicketStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      open: {
        bg: "bg-blue-400/10",
        text: "text-blue-400",
        label: "Open",
      },
      in_progress: {
        bg: "bg-yellow-400/10",
        text: "text-yellow-400",
        label: "In Progress",
      },
      resolved: {
        bg: "bg-green-400/10",
        text: "text-green-400",
        label: "Resolved",
      },
      closed: {
        bg: "bg-gray-400/10",
        text: "text-gray-400",
        label: "Closed",
      },
    };
    return configs[status?.toLowerCase()] || configs.open;
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default TicketStatusBadge;
