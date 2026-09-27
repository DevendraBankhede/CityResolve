export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f1f5f9'><rect width='400' height='300' fill='%23f1f5f9'/><path d='M160 130 L200 90 L240 130 L240 210 L160 210 Z' fill='%23cbd5e1'/><circle cx='200' cy='120' r='15' fill='%230284c7'/><text x='200' y='250' font-family='sans-serif' font-size='14' font-weight='bold' fill='%2364748b' text-anchor='middle'>No Image Available</text></svg>";
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export const getPriorityBadgeClass = (priority) => {
  switch ((priority || "").toLowerCase()) {
    case "low":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "medium":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};
