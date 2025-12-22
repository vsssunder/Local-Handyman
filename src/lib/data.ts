

import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, query, where, arrayUnion, arrayRemove, Firestore } from "firebase/firestore";

export const serviceCategories = [
  "Plumbing",
  "Painting",
  "Electrical",
  "Carpentry",
  "Cleaning",
  "General Handyman",
];

export const featuredWorkers = [
  {
    id: "1",
    name: "John Doe",
    specialty: "Master Plumber",
    rating: 4.9,
    skills: ["Pipe Fitting", "Drain Cleaning", "Water Heaters"],
    imageUrl: "https://placehold.co/400x300.png",
    avatarUrl: "https://placehold.co/40x40.png",
  },
  {
    id: "2",
    name: "Jane Smith",
    specialty: "Residential Electrician",
    rating: 4.8,
    skills: ["Wiring", "Lighting", "Panel Upgrades"],
    imageUrl: "https://placehold.co/400x300.png",
    avatarUrl: "https://placehold.co/40x40.png",
  },
  {
    id: "3",
    name: "Carlos Garcia",
    specialty: "Interior & Exterior Painter",
    rating: 4.9,
    skills: ["Drywall Repair", "Color Consulting", "Staining"],
    imageUrl: "https://placehold.co/400x300.png",
    avatarUrl: "https://placehold.co/40x40.png",
  },
  {
    id: "4",
    name: "Aisha Khan",
    specialty: "Custom Carpentry",
    rating: 5.0,
    skills: ["Cabinet Making", "Trim Work", "Furniture Assembly"],
    imageUrl: "https://placehold.co/400x300.png",
    avatarUrl: "https://placehold.co/40x40.png",
  },
];


export const addUserProfile = async (profile: any, db: Firestore) => {
  if (!db) throw new Error("Firestore is not initialized");
  try {
    // Use setDoc with the user's UID to ensure we don't create duplicate profiles
    await setDoc(doc(db, "users", profile.id), profile, { merge: true });
    console.log("User profile saved to Firestore");
  } catch (error) {
    console.error("Error adding/updating document: ", error);
    throw error;
  }
};

export const getUserProfile = async (userId: string, db: Firestore) => {
  if (!db) throw new Error("Firestore is not initialized");
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {...docSnap.data(), id: docSnap.id };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: any, db: Firestore) => {
    if (!db) throw new Error("Firestore is not initialized");
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, data);
        console.log("User profile updated in Firestore");
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
}

export const updateUserSkills = async (userId: string, skills: string[], db: Firestore) => {
    if (!db) throw new Error("Firestore is not initialized");
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { skills });
        console.log("User skills updated in Firestore");
    } catch (error) {
        console.error("Error updating skills: ", error);
        throw error;
    }
};

export const updateUserLocations = async (userId: string, locations: string[], db: Firestore) => {
    if (!db) throw new Error("Firestore is not initialized");
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { workingLocations: locations });
        console.log("User locations updated in Firestore");
    } catch (error) {
        console.error("Error updating locations: ", error);
        throw error;
    }
};


export const addJob = async (jobData: any, db: Firestore) => {
  if (!db) throw new Error("Firestore is not initialized");
  try {
    const user = await getUserProfile(jobData.customerId, db);
    const docRef = await addDoc(collection(db, "jobs"), {
      ...jobData,
      customerName: user?.name || "Anonymous",
      postedDate: new Date().toISOString(),
      status: 'open',
    });
    console.log("Job added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding job: ", error);
    throw error;
  }
};

export const getAllJobs = async (db: Firestore) => {
  if (!db) return [];
  const jobsCol = query(collection(db, 'jobs'));
  const jobSnapshot = await getDocs(jobsCol);
  const jobList = jobSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return jobList;
}

export const getJobById = async (jobId: string, db: Firestore) => {
  if (!db) return null;
  const docRef = doc(db, "jobs", jobId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const getWorkers = async (db: Firestore) => {
  if (!db) return [];
  const q = query(collection(db, "users"), where("role", "==", "worker"));
  const querySnapshot = await getDocs(q);
  const workerList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return workerList;
}
