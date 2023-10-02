import { db } from "./firebase";
import { onValue, ref, set, child, get } from "firebase/database";

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

export function updateCurrent(budget, uid, newValue) {
  set(ref(db, `budgetInstances/${uid}/${budget}/current`), newValue);
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
      console.log("templateData", templateData);
      set(ref(db, `budgetInstances/${uid}`), templateData);
    });
  }
}
