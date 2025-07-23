// Mobile/src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAd2mzcig58aweZRUVMFwFFLw4xLCqmtaE",
  authDomain: "animtech-e286f.firebaseapp.com",
  databaseURL: "https://animtech-e286f-default-rtdb.firebaseio.com",
  projectId: "animtech-e286f",
  storageBucket: "animtech-e286f.appspot.com",
  messagingSenderId: "683066591020",
  appId: "1:683066591020:web:1c77aa1e0dbddca40cce89"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export { db, storage };   