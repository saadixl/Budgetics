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

export function calculateDailySpend(history) {
  if (!history || Object.keys(history).length === 0) {
    return 0;
  }

  const now = new Date();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const historyEntries = Object.values(history);
  
  // Custom month period: 28th to 27th of next month
  let periodStart, periodEnd;
  const currentDate = now.getDate();
  
  if (currentDate >= 28) {
    // If today is 28th or later, period is from 28th of current month to 27th of next month
    periodStart = new Date(now.getFullYear(), now.getMonth(), 28);
    periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 27, 23, 59, 59, 999);
  } else {
    // If today is before 28th, period is from 28th of previous month to 27th of current month
    periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 28);
    periodEnd = new Date(now.getFullYear(), now.getMonth(), 27, 23, 59, 59, 999);
  }
  
  // Get expenses from the current period (28th to 27th)
  const currentPeriodExpenses = historyEntries.filter((entry) => {
    const expenseDate = new Date(entry.timestamp);
    return expenseDate >= periodStart && expenseDate <= periodEnd;
  });

  if (currentPeriodExpenses.length === 0) {
    return 0;
  }

  // Calculate total spent in this period
  const totalSpent = currentPeriodExpenses.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  
  // Calculate days since start of period
  const daysSinceStart = Math.max(1, Math.floor((now.getTime() - periodStart.getTime()) / oneDayMs));
  
  // Average daily spend
  return totalSpent / daysSinceStart;
}

export function calculateDaysRemaining(remainingBudget, dailySpend) {
  if (!dailySpend || dailySpend <= 0) {
    return null; // Can't calculate if no spending data
  }
  
  if (remainingBudget <= 0) {
    return 0;
  }
  
  const days = remainingBudget / dailySpend;
  return Math.floor(days);
}
