import { db } from "./firebase";
import { onValue, ref, set, child, get, push } from "firebase/database";

const DEFAULT_BUDGET_TEMPLATE = {
  bills: {
    budget: 100,
    title: "Bills",
  },
  commute: {
    budget: 200,
    title: "Commute",
  },
  eatingout: {
    budget: 300,
    title: "Eating out",
  },
  exception: {
    budget: 400,
    title: "Exception",
  },
  groceries: {
    budget: 500,
    title: "Groceries",
  },
  health: {
    budget: 600,
    title: "Health",
  },
  shopping: {
    budget: 700,
    title: "Shopping",
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

export function getBudgetTemplate(uid, set) {
  if (uid) {
    const dbRef = ref(db);
    get(child(dbRef, `budgetTemplates/${uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map((key) => {
          const item = data[key];
          return {
            ...item,
            key,
          };
        });
        set(list);
      } else {
        set([]);
      }
    });
  }
}

export function getCurrentMonthsBudgets(uid, set, setTotalBalance) {
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

export function updateBudgetTemplate(uid, templateArr) {
  if (uid && templateArr) {
    const templateObj = {};
    templateArr.forEach((item) => {
      const { budget, title } = item;
      const finalKey = title.split(" ").join("").toLowerCase();
      templateObj[finalKey] = {
        budget,
        title,
      };
      // TODO: This needs to be optimised
      set(ref(db, `budgetInstances/${uid}/${finalKey}/budget`), budget);
    });
    set(ref(db, `budgetTemplates/${uid}`), templateObj);
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

export function archiveMonth(uid) {
  if (uid) {
    const dbRef = ref(db);
    get(child(dbRef, `budgetInstances/${uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const currentMonth = snapshot.val();
        set(ref(db, `archives/${uid}/${year}/${month}`), currentMonth);
      }
    });
  }
}
