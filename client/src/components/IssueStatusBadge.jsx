import React from "react";
import { STATUS_OPTIONS } from "../utils/constants";

const IssueStatusBadge = ({ status, size = "md" }) => {
  const matched = STATUS_OPTIONS.find(
    (opt) => opt.value.toLowerCase() === (status || "").toLowerCase()
  );

  const colorClass = matched
    ? matched.color
    : "bg-slate-100 text-slate-700 border-slate-300";

  const sizeClass =
    size === "sm"
      ? "px-2 py-0.5 text-[11px] font-bold"
      : "px-2.5 py-1 text-xs font-bold";

  return (
    <span className={`inline-flex items-center rounded-full border ${colorClass} ${sizeClass}`}>
      {status || "Reported"}
    </span>
  );
};

export default IssueStatusBadge;
