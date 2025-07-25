import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "active";
      case "on leave":
      case "leave":
        return "leave";
      case "terminated":
        return "terminated";
      default:
        return "default";
    }
  };

  return (
    <Badge variant={getStatusVariant(status)}>
      {status}
    </Badge>
  );
};

export default StatusBadge;