import { db } from "./firebase";
import { onValue, ref, set, child, get } from "firebase/database";

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
  if(uid) {
    const dbRef = ref(db);
    get(child(dbRef, `budgetInstances/${uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        set(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
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
