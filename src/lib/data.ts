import { db } from "./firebase";
import { doc, setDoc, getDoc, collection, addDoc, getDocs, getDocFromCache, query, where } from "firebase/firestore";

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

export let jobs = [
  {
    id: "job-1",
    title: "Leaky Faucet Repair in Kitchen",
    customer: "Alice Johnson",
    location: "San Francisco, CA",
    category: "Plumbing",
    postedDate: "2024-05-18T10:00:00Z",
    description: "My kitchen sink faucet has been dripping for the past week. It seems to be a slow but steady leak from the base. Need a professional to diagnose and fix it.",
    budget: 150,
  },
  {
    id: "job-2",
    title: "Install New Ceiling Fan",
    customer: "Bob Williams",
    location: "Oakland, CA",
    category: "Electrical",
    postedDate: "2024-05-17T14:30:00Z",
    description: "I've purchased a new ceiling fan for my living room and need an electrician to install it. The wiring is already in place from a previous light fixture.",
    budget: 200,
  },
  {
    id: "job-3",
    title: "Paint Living Room Walls",
    customer: "Charlie Brown",
    location: "San Francisco, CA",
    category: "Painting",
    postedDate: "2024-05-19T09:00:00Z",
    description: "Looking to repaint my living room. The room is approximately 15x20 feet. I will provide the paint, but the painter needs to bring all other supplies (brushes, rollers, drop cloths).",
    budget: 500,
  },
   {
    id: "job-4",
    title: "Assemble IKEA Bookshelf",
    customer: "Diana Prince",
    location: "Berkeley, CA",
    category: "General Handyman",
    postedDate: "2024-05-19T11:00:00Z",
    description: "I need help assembling a 'Billy' bookshelf from IKEA. All parts and instructions are available. Should be a quick job for someone experienced.",
    budget: 75,
  },
];

export let workers = [
  ...featuredWorkers,
  {
    id: "5",
    name: "Emily White",
    specialty: "General Handyman",
    rating: 4.7,
    skills: ["Furniture Assembly", "Minor Repairs", "Picture Hanging"],
    imageUrl: "https://placehold.co/400x300.png",
    avatarUrl: "https://placehold.co/40x40.png",
    reviews: [
      { id: 'r1', author: 'Diana P.', rating: 5, comment: 'Emily was fast and professional. My bookshelf looks great!' },
      { id: 'r2', author: 'Frank C.', rating: 4, comment: 'Good work, but was a little late.' },
    ],
    bio: "With over 5 years of experience in home repairs and assembly, I provide reliable and efficient handyman services. No job is too small!",
    workingLocations: ["Berkeley, CA", "Albany, CA"]
  },
];

// This will be replaced by Firestore fetching later.
export let userProfiles: Record<string, any> = {
  customer: {
    id: "user-cust-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "customer",
    avatarUrl: "https://placehold.co/40x40.png",
    activeJobs: [jobs[0]],
    completedJobs: [],
  },
  worker: {
    id: "user-work-1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "worker",
    avatarUrl: "https://placehold.co/40x40.png",
    specialty: "Master Plumber",
    rating: 4.9,
    skills: ["Pipe Fitting", "Drain Cleaning", "Water Heaters", "Leak Detection", "Toilet Repair"],
    workingLocations: ["San Francisco, CA", "Daly City, CA"],
    bio: "15 years of experience in commercial and residential plumbing. I guarantee clean, professional work and timely service. Licensed and insured.",
    activeJobs: [],
    completedJobs: [
      {...jobs[0], status: 'Completed', earnings: 140},
    ],
  }
};

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
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

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
    return { id: docSnap.id, ...docSnap.data() };
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
