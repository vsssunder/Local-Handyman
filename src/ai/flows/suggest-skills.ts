// 'use server'
'use server';
/**
 * @fileOverview Skill suggestion AI agent.
 *
 * - suggestSkills - A function that suggests skills based on the job description.
 * - SuggestSkillsInput - The input type for the suggestSkills function.
 * - SuggestSkillsOutput - The return type for the suggestSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSkillsInputSchema = z.object({
  jobDescription: z.string().describe('The description of the job.'),
});
export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;

const SuggestSkillsOutputSchema = z.object({
  suggestedSkills: z
    .array(z.string())
    .describe('An array of suggested skills based on the job description.'),
});
export type SuggestSkillsOutput = z.infer<typeof SuggestSkillsOutputSchema>;

export async function suggestSkills(input: SuggestSkillsInput): Promise<SuggestSkillsOutput> {
  return suggestSkillsFlow(input);
}

const prompt = ai().definePrompt({
  name: 'suggestSkillsPrompt',
  input: {schema: SuggestSkillsInputSchema},
  output: {schema: SuggestSkillsOutputSchema},
  prompt: `You are an expert in identifying required skills based on job descriptions.

  Given the following job description, suggest a list of skills that a worker should have to fulfill the job requirements.
  Return the skills as a JSON array of strings.

  Job Description: {{{jobDescription}}}`,
});

const suggestSkillsFlow = ai().defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SuggestSkillsInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
