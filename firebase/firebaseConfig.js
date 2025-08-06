import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyAoer09OK5EPK6oFtCjIs8FxfHUVRYppUA",
  authDomain: "lab-server-5128b.firebaseapp.com",
  databaseURL: "https://lab-server-5128b-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "lab-server-5128b",
  storageBucket: "lab-server-5128b.firebasestorage.app",
  messagingSenderId: "198218370729",
  appId: "1:198218370729:web:d6aaf5e3c224ad330be3b8"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {database};