"use server";

import { suggestSkills } from "@/ai/flows/suggest-skills";
import { updateUserProfile } from "@/lib/data";
import { z } from "zod";

const skillSuggesterSchema = z.object({
  jobDescription: z.string().min(10, 'Job description must be at least 10 characters long.'),
});

type SkillSuggesterState = {
  suggestedSkills?: string[];
  error?: string | null;
}

export async function handleSkillSuggestion(prevState: SkillSuggesterState, formData: FormData): Promise<SkillSuggesterState> {
  const validatedFields = skillSuggesterSchema.safeParse({
    jobDescription: formData.get('jobDescription'),
  });
  
  if (!validatedFields.success) {
    return {
      suggestedSkills: [],
      error: validatedFields.error.flatten().fieldErrors.jobDescription?.[0] || 'Invalid input.',
    };
  }

  try {
    const result = await suggestSkills({ jobDescription: validatedFields.data.jobDescription });
    if (result && result.suggestedSkills) {
      return { suggestedSkills: result.suggestedSkills, error: null };
    }
    return { suggestedSkills: [], error: 'Could not generate skills.' };
  } catch (error) {
    console.error(error);
    return { suggestedSkills: [], error: 'An unexpected error occurred.' };
  }
}

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  specialty: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormState = {
    message: string;
    error?: boolean;
}

export async function handleUpdateProfile(userId: string, prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
    if (!userId) {
        return { message: "Error: User not authenticated.", error: true };
    }

    const validatedFields = profileFormSchema.safeParse({
        name: formData.get('name'),
        specialty: formData.get('specialty'),
        bio: formData.get('bio'),
    });

    if (!validatedFields.success) {
        return {
            message: validatedFields.error.flatten().fieldErrors.name?.[0] || 'Invalid input.',
            error: true
        };
    }

    try {
        await updateUserProfile(userId, validatedFields.data);
        return { message: "Profile updated successfully!", error: false };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { message: "An unexpected error occurred while updating the profile.", error: true };
    }
}
