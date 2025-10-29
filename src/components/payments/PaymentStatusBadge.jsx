import React from "react";

const PaymentStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: "bg-yellow-400/10",
        text: "text-yellow-400",
        label: "Pending",
      },

      requested: {
        bg: "bg-yellow-400/10",
        text: "text-yellow-400",
        label: "Requested",
      },
      approved: {
        bg: "bg-green-400/10",
        text: "text-green-400",
        label: "Approved",
      },
      rejected: {
        bg: "bg-red-400/10",
        text: "text-red-400",
        label: "Rejected",
      },
      completed: {
        bg: "bg-purple-400/10",
        text: "text-purple-400",
        label: "Completed",
      },

      paid: {
        bg: "bg-purple-400/10",
        text: "text-purple-400",
        label: "Paid",
      },
      "awaiting-confirmation": {
        bg: "bg-blue-400/10",
        text: "text-blue-400",
        label: "Awaiting Confirmation",
      },
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

export default PaymentStatusBadge;
