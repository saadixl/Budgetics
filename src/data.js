import { db } from "./firebase";
import { onValue, ref, set } from "firebase/database";

export function getBudgets(uid, set) {
  const query = ref(db, `budgets/${uid}`);
  return onValue(query, (snapshot) => {
    const data = snapshot.val();
    if (snapshot.exists()) {
      set(data);
    }
  });
}

export function updateCurrent(budget, uid, newValue) {
  set(ref(db, `budgets/${uid}/${budget}/current`), newValue);
}

export function resetMonth(uid) {
  const query = ref(db, `budgets/template`);
  return onValue(query, (snapshot) => {
    const data = snapshot.val();
    if (snapshot.exists()) {
      const templateData = snapshot.val();
      set(ref(db, `budgets/${uid}`), templateData);
    }
  });
}
