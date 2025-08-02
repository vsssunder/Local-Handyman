"use server";

import { suggestSkills } from "@/ai/flows/suggest-skills";
import { z } from "zod";

const formSchema = z.object({
  jobDescription: z.string().min(10, 'Job description must be at least 10 characters long.'),
});

type State = {
  suggestedSkills?: string[];
  error?: string | null;
}

export async function handleSkillSuggestion(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = formSchema.safeParse({
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
