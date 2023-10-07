import { db } from "./firebase";
import { onValue, ref, set, child, get, push } from "firebase/database";

const DEFAULT_BUDGET_TEMPLATE = {
  bills: {
    budget: 150,
  },
  commute: {
    budget: 60,
  },
  eatingout: {
    budget: 120,
  },
  groceries: {
    budget: 500,
  },
  health: {
    budget: 200,
  },
  shopping: {
    budget: 100,
  },
};

function calculateTotalBalance(data, setTotalBalance) {
  if (data) {
    let total = 0;
    Object.keys(data).forEach((key) => {
      const item = data[key];
      const { budget = 0, current = 0 } = item;
      total += budget - current;
    });
    setTotalBalance(total);
  }
}

export function getBudgets(uid, set, setTotalBalance) {
  if (uid) {
    const query = ref(db, `budgetInstances/${uid}`);
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        set(data);
        calculateTotalBalance(data, setTotalBalance);
      }
    });
  }
}

export function updateCurrent(uid, payload) {
  const { amount, amountForHistory, budget, description } = payload;
  const convertedAmount = parseFloat(amount);
  if (uid) {
    set(ref(db, `budgetInstances/${uid}/${budget}/current`), convertedAmount);
    if (description && amountForHistory) {
      push(child(ref(db), `budgetInstances/${uid}/${budget}/history`), {
        description,
        timestamp: Date.now(),
        amount: amountForHistory,
      });
    }
  }
}

export function updateBudget(uid, { amount, budget }) {
  const value = parseFloat(amount);
  if (uid) {
    const budgetPath = `${uid}/${budget}/budget`;
    set(ref(db, `budgetInstances/${budgetPath}`), value);
    set(ref(db, `budgetTemplates/${budgetPath}`), value);
  }
}

export function resetMonth(uid) {
  if (uid) {
    const dbRef = ref(db);
    get(child(dbRef, `budgetTemplates/${uid}`)).then((snapshot) => {
      let templateData;
      if (snapshot.exists()) {
        templateData = snapshot.val();
      } else {
        templateData = DEFAULT_BUDGET_TEMPLATE;
      }
      set(ref(db, `budgetInstances/${uid}`), templateData);
    });
  }
}

export function deleteHistory(uid, { amount, budget, key, current }) {
  if (uid && key) {
    set(ref(db, `budgetInstances/${uid}/${budget}/history/${key}`), null);
    if (amount) {
      set(
        ref(db, `budgetInstances/${uid}/${budget}/current`),
        current - amount,
      );
    }
  }
}
