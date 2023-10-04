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

export function getBudgets(uid, set) {
  if (uid) {
    const query = ref(db, `budgetInstances/${uid}`);
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists()) {
        set(data);
      }
    });
  }
}

export function updateCurrent(budget, uid, payload) {
  const { amount, description, amountForHistory } = payload;
  const convertedAmount = parseFloat(amount);
  set(ref(db, `budgetInstances/${uid}/${budget}/current`), convertedAmount);
  if (description && amountForHistory) {
    push(child(ref(db), `budgetInstances/${uid}/${budget}/history`), {
      description,
      timestamp: Date.now(),
      amount: amountForHistory,
    });
  }
}

export function updateBudget(budget, uid, newValue) {
  const value = parseFloat(newValue);
  const budgetPath = `${uid}/${budget}/budget`;
  set(ref(db, `budgetInstances/${budgetPath}`), value);
  set(ref(db, `budgetTemplates/${budgetPath}`), value);
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
