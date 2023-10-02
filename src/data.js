import { db } from "./firebase";
import { onValue, ref, set } from "firebase/database";

const DEFAULT_BUDGET_TEMPLATE = {
  "bills": {
    "budget": 150
  },
  "commute": {
    "budget": 60
  },
  "eatingout": {
    "budget": 120
  },
  "groceries": {
    "budget": 500
  },
  "health": {
    "budget": 200
  },
  "shopping": {
    "budget": 100
  }
};

export function getBudgets(uid, set) {
  const query = ref(db, `budgetInstances/${uid}`);
  return onValue(query, (snapshot) => {
    const data = snapshot.val();
    if (snapshot.exists()) {
      set(data);
    }
  });
}

export function updateCurrent(budget, uid, newValue) {
  set(ref(db, `budgetInstances/${uid}/${budget}/current`), newValue);
}

export function resetMonth(uid) {
  const query = ref(db, `budgetTemplates/${uid}`);
  return onValue(query, (snapshot) => {
    let templateData;
    if (snapshot.exists()) {
      templateData = snapshot.val();
    } else {
      templateData = DEFAULT_BUDGET_TEMPLATE;
    }
    set(ref(db, `budgetInstances/${uid}`), templateData);
  });
}
