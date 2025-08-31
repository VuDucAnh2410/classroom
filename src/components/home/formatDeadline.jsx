export const formatDeadline = (deadline) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  // Reset giờ để so sánh chính xác các ngày
  const resetTime = (date) => date.setHours(0, 0, 0, 0);
  resetTime(today);
  resetTime(tomorrow);
  resetTime(deadlineDate);

  if (deadlineDate === today) {
    return "Hôm nay";
  }
  if (deadlineDate === tomorrow) {
    return "Ngày mai";
  }
  return new Date(deadline).toLocaleString("vi-VN");
};
