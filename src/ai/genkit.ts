import {genkit, Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

let ai: Genkit;

function getAi() {
  if (!ai) {
    ai = genkit({
      plugins: [googleAI()],
      model: 'googleai/gemini-2.0-flash',
    });
  }
  return ai;
}

export {getAi as ai};
