import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { FIREBASE } from "./config";

const app = initializeApp(FIREBASE);
const db = getFirestore(app);

export { app, db };
