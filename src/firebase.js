import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKkWEe-nSSIl5-XiiRQFiu7qiZ5XX_BYw",
  authDomain: "schedule-org-se.firebaseapp.com",
  projectId: "schedule-org-se",
  storageBucket: "schedule-org-se.appspot.com",
  messagingSenderId: "24749583339",
  appId: "1:24749583339:web:3c85bacd152725965fc7ae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
