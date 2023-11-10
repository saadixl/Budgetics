import { toast } from "react-toastify";

export function showAlert(message, type) {
  let customToast = toast.success;
  if (type === "warning") {
    customToast = toast.warning;
  }
  customToast(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}

export const getChartData = (currentMonthBudget) => {
  const budgets = Object.keys(currentMonthBudget);
  if (!budgets.length) {
    return;
  } else {
    const labels = budgets;
    let data1 = [],
      data2 = [],
      data3 = [];
    budgets.forEach((key) => {
      const { current = 0, budget = 0 } = currentMonthBudget[key];
      data1.push(parseInt(current));
      data2.push(parseInt(budget - current));
      data3.push(parseInt(budget));
    });
    return {
      labels,
      data1,
      data2,
      data3,
    };
  }
};

export function getBudgetTitle(budgetTypes, key) {
  if (typeof budgetTypes === "string") {
    return budgetTypes;
  }
  if (key) {
    const matched = budgetTypes.filter((item) => {
      return item.key === key;
    });
    if (matched && matched.length) {
      return matched[0].title;
    }
  }
  return "Unknown";
}