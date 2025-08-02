import { db } from "./firebase";
import { doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, query, where } from "firebase/firestore";

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


export const addUserProfile = async (profile: any) => {
  try {
    await setDoc(doc(db, "users", profile.id), profile);
    console.log("User profile saved to Firestore");
  } catch (error) {
    console.error("Error adding document: ", error);
    // You might want to throw the error or handle it appropriately
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
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

export const updateUserProfile = async (userId: string, data: any) => {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, data);
        console.log("User profile updated in Firestore");
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
}


export const addJob = async (jobData: any) => {
  try {
    const docRef = await addDoc(collection(db, "jobs"), {
      ...jobData,
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

export const getAllJobs = async () => {
  const jobsCol = collection(db, 'jobs');
  const jobSnapshot = await getDocs(jobsCol);
  const jobList = jobSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return jobList;
}

export const getJobById = async (jobId: string) => {
  const docRef = doc(db, "jobs", jobId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const jobData = docSnap.data();
    // Fetch customer data
    if (jobData.customerId) {
        const customerProfile = await getUserProfile(jobData.customerId);
        jobData.customerName = customerProfile?.name || 'Unknown User';
    }
    return { id: docSnap.id, ...jobData };
  } else {
    return null;
  }
};

export const getWorkers = async () => {
  const q = query(collection(db, "users"), where("role", "==", "worker"));
  const querySnapshot = await getDocs(q);
  const workerList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return workerList;
}