// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Adjusts game difficulty dynamically based on player performance.
 *
 * - adjustDifficulty - Adjusts the game difficulty based on player performance.
 * - AdjustDifficultyInput - The input type for the adjustDifficulty function.
 * - AdjustDifficultyOutput - The return type for the adjustDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustDifficultyInputSchema = z.object({
  score: z.number().describe('The player score.'),
  level: z.number().describe('The level the player is on.'),
  obstaclesAvoided: z.number().describe('The number of obstacles avoided.'),
  bitsCollected: z.number().describe('The number of bits collected.'),
  timePlayed: z.number().describe('The time played in seconds.'),
});
export type AdjustDifficultyInput = z.infer<typeof AdjustDifficultyInputSchema>;

const AdjustDifficultyOutputSchema = z.object({
  obstacleFrequency: z
    .number()
    .describe('The frequency of obstacles. Higher values mean more obstacles.'),
  platformSpacing: z
    .number()
    .describe(
      'The spacing between platforms. Higher values mean larger gaps between platforms.'
    ),
});
export type AdjustDifficultyOutput = z.infer<typeof AdjustDifficultyOutputSchema>;

export async function adjustDifficulty(input: AdjustDifficultyInput): Promise<AdjustDifficultyOutput> {
  return adjustDifficultyFlow(input);
}

const adjustDifficultyPrompt = ai.definePrompt({
  name: 'adjustDifficultyPrompt',
  input: {schema: AdjustDifficultyInputSchema},
  output: {schema: AdjustDifficultyOutputSchema},
  prompt: `You are a game designer. Your task is to adjust the difficulty of the game based on the player's performance. The game is an infinite runner where the player has to avoid obstacles and collect bits.

Player Score: {{score}}
Level: {{level}}
Obstacles Avoided: {{obstaclesAvoided}}
Bits Collected: {{bitsCollected}}
Time Played: {{timePlayed}}

Based on this information, adjust the obstacle frequency and platform spacing to keep the game challenging and engaging. Provide a floating point number between 0.1 and 2.0 for both parameters.

Obstacle Frequency: The frequency of obstacles. Higher values mean more obstacles.
Platform Spacing: The spacing between platforms. Higher values mean larger gaps between platforms.`,
});

const adjustDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustDifficultyFlow',
    inputSchema: AdjustDifficultyInputSchema,
    outputSchema: AdjustDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustDifficultyPrompt(input);
    return output!;
  }
);
