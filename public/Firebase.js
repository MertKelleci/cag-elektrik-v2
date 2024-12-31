import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  startAfter,
  limit,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  where,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfHDoYAHk3ekiklTZmSC1t0HKghe2ZIW0",
  authDomain: "cag-elektrik.firebaseapp.com",
  projectId: "cag-elektrik",
  storageBucket: "cag-elektrik.firebasestorage.app",
  messagingSenderId: "853232143728",
  appId: "1:853232143728:web:767e2f31bc38d1141293b5",
};
initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();
const brandsRef = collection(db, "brands");
const itemsRef = collection(db, "items");
const usersRef = collection(db, "users");
const receiptsRef = collection(db, "receipts");
function refSelect(collectionName) {
  let collectionRef;
  switch (collectionName) {
    case "brands":
      collectionRef = brandsRef;
      break;
    case "users":
      collectionRef = usersRef;
      break;
    case "receipts":
      collectionRef = receiptsRef;
      break;
    default:
      collectionRef = itemsRef;
      break;
  }
  return collectionRef;
}

export const getSnapshot = async ({ collectionName }) => {
  let items = [];
  await getDocs(refSelect(collectionName))
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        items.push({ ...doc.data(), id: doc.id });
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
  return items;
};

export const querybyParameter = async (searchValue, sender) => {
  let q1, q2, q3, q4;
  if (sender === "Receipts") {
    q1 = query(receiptsRef, where("company", "<=", searchValue + "\uf8ff"));
    q2 = query(receiptsRef, where("customer", "<=", searchValue + "\uf8ff"));
    q3 = query(receiptsRef, where("company", "<=", "\uf8ff" + searchValue));
    q4 = query(receiptsRef, where("customer", "<=", "\uf8ff" + searchValue));
  } else if (sender === "EditCompany") {
    q1 = query(receiptsRef, where("serial", "<=", searchValue + "\uf8ff"));
    q2 = query(receiptsRef, where("name", "<=", searchValue + "\uf8ff"));
    q3 = query(receiptsRef, where("serial", "<=", "\uf8ff" + searchValue));
    q4 = query(receiptsRef, where("name", "<=", "\uf8ff" + searchValue));
  } else {
    q1 = query(receiptsRef, where("serial", "<=", searchValue + "\uf8ff"));
    q2 = query(receiptsRef, where("name", "<=", searchValue + "\uf8ff"));
    q3 = query(receiptsRef, where("serial", "<=", "\uf8ff" + searchValue));
    q4 = query(receiptsRef, where("name", "<=", "\uf8ff" + searchValue));
  }

  const items = [];
  await getDocs(q1).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id });
    });
  });
  await getDocs(q2).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id });
    });
  });
  await getDocs(q3).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id });
    });
  });
  await getDocs(q4).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      items.push({ ...doc.data(), id: doc.id });
    });
  });

  return items;
};

export const addItem = async (item, collectionName) => {
  const q = query(
    refSelect(collectionName),
    where("serial", "==", `${item.serial}`)
  );
  const snapshot = await getDocs(q);
  let message;
  if (snapshot.docs.length !== 0) {
    message = "Girdi hali hazırda eklenmiş!";
  } else {
    await addDoc(refSelect(collectionName), item)
      .then(() => {
        message = "Girdi başarıyla veri tabanına eklendi!";
      })
      .catch((err) => {
        console.log(err);
        message = "Girdi sırasında hata meydana geldi!";
      });
  }
  return message;
};
export const addReceipt = async (data) => {
  const { cart, info, currentUser } = data;
  const receipt = {
    company: info.company,
    customer: info.buyer,
    date: serverTimestamp(),
    items: cart,
    currentUser: currentUser,
    total: info.total,
    payment: info.payment,
  };
  cart.forEach(async (item) => {
    await itemSold(item.id, item.amount);
  });
  const message = await addItem(receipt, "receipts");
  return message;
};

export const itemSold = async (id, amount) => {
  const docRef = doc(db, "items", id);
  const flag = await getDoc(docRef)
    .then((item) => {
      return item.data();
    })
    .catch((err) => {
      console.log("Firebase.js itemSoled function error: " + err);
    });
  updateDoc(docRef, { stored: flag.stored - amount })
    .then(() => {
      console.log("Satış Başarılı");
    })
    .catch((err) => {
      console.log("Satış Başarısız: " + err);
    });
};
export const paginatedQuery = async (collectionName, lastdoc) => {
  let q;
  if (collectionName == "receipts") {
    console.log("collection name is receipts");
    let lastdocSnapshot = null;
    if (lastdoc != null) {
      const docRef = doc(db, "receipts", lastdoc.id);
      lastdocSnapshot = await getDoc(docRef);
    }
    q = query(
      refSelect(collectionName),
      orderBy("date"),
      startAfter(lastdocSnapshot || 0),
      limit(20)
    );
  } else {
    q = query(
      refSelect(collectionName),
      orderBy("serial"),
      startAfter(lastdoc?.serial || 0),
      limit(10)
    );
  }

  const data = await getDocs(q);
  const items = [];
  data.docs.forEach((doc) => {
    items.push({ ...doc.data(), id: doc.id });
  });
  return items;
};

export const getDiscount = async (brandID) => {
  const q = await getDocs(brandsRef);
  let discount;
  q.forEach((doc) => {
    if (doc.id === brandID) {
      discount = doc.data();
    }
  });
  return discount.discount;
};
export const updateItem = async (item, id, collectionName) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, item)
    .then(() => {
      return "Güncelleme başarılı.";
    })
    .catch(() => {
      return "Güncelleme başarısız.";
    });
};
export const deleteItem = async (itemID, collectionName) => {
  const docRef = doc(db, collectionName, itemID);
  const message = await deleteDoc(docRef)
    .then(() => {
      return "Silme İşlemi Başarılı";
    })
    .catch((e) => {
      return "Silme İşlemi Başarısız: " + e;
    });
  return message;
};
export const login = async (email, password) => {
  const user = await signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const flag = await getUserInfo(userCredential.user.uid);
      return {
        status: 200,
        message: "Giriş Başarılı",
        user: flag,
      };
    })
    .catch((err) => {
      return {
        status: err.code,
        message: "Giriş Başarısız: " + err.message,
        user: null,
      };
    });
  return user;
};
export const logout = async () => {
  const message = await signOut(auth)
    .then(() => {
      return "Çıkış Başarılı";
    })
    .catch((err) => {
      return "Çıkış sırasında hata: " + err;
    });
  return message;
};

export const getUserInfo = async (uid) => {
  const q = query(usersRef, where("uid", "==", `${uid}`));
  const data = await getDocs(q);
  let item;
  data.docs.forEach((doc) => {
    item = { ...doc.data(), id: doc.id };
  });
  return item;
};
export const searchWithDates = async (fDate, lDate) => {
  const date1 = Timestamp.fromDate(fDate);
  const date2 = Timestamp.fromDate(lDate);
  const q = query(
    receiptsRef,
    where("date", "<=", date2),
    where("date", ">=", date1)
  );
  const data = await getDocs(q);
  let items = [];
  data.docs.forEach((doc) => {
    items.push({ ...doc.data(), id: doc.id });
  });
  return items;
};
