"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { handleSkillSuggestion } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  suggestedSkills: [],
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full gap-2">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      Suggest Skills
    </Button>
  );
}

export function SkillSuggester({ currentBio, onSkillSelect }: { currentBio?: string, onSkillSelect: (skill: string) => void }) {
  const [state, formAction] = useFormState(handleSkillSuggestion, initialState);
  const { toast } = useToast();

  const handleAddSkill = (skill: string) => {
    onSkillSelect(skill);
    toast({
      title: "Skill Added!",
      description: `"${skill}" has been added. Don't forget to save your profile.`,
    })
  }
  
  return (
    <Card className="mt-6 bg-primary/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-500" />
            <CardTitle className="font-headline">AI Skill Suggester</CardTitle>
        </div>
        <CardDescription>
          Use your bio to let AI suggest relevant skills for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Your Bio or a Job Description</Label>
            <Textarea
              id="jobDescription"
              name="jobDescription"
              rows={5}
              placeholder="e.g., 'Experienced in residential and commercial plumbing, including pipe fitting, drain cleaning, and water heater installation...'"
              defaultValue={currentBio}
            />
          </div>
          <SubmitButton />
        </form>
        
        {state.error && (
            <p className="text-destructive mt-4 text-sm">{state.error}</p>
        )}

        {state.suggestedSkills && state.suggestedSkills.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Suggested Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {state.suggestedSkills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-accent/20 hover:border-accent"
                  onClick={() => handleAddSkill(skill)}
                  title="Click to add this skill"
                >
                  {skill}
                </Badge>
              ))}
            </div>
             <p className="text-xs text-muted-foreground mt-2">Click on a skill to add it to your profile.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
