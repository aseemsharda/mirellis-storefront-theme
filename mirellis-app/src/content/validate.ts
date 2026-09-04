import type { Transition } from '@/lib/types';

const requiredExperienceFields = ['id', 'sourceId', 'version', 'semanticVersion', 'state', 'title', 'beliefUnderTest', 'capability', 'prompt', 'choicePrompt', 'action', 'observation', 'reflection', 'completion', 'fallback', 'contentHash'] as const;

export function validateTransitions(transitions: Transition[]): void {
  if (transitions.length !== 7) throw new Error(`Expected seven transitions, received ${transitions.length}.`);

  const ids = new Set<string>();
  for (const transition of transitions) {
    if (transition.states.length !== 5) throw new Error(`${transition.id} must contain five learning states.`);
    if (transition.experiences.length !== 15) throw new Error(`${transition.id} must contain fifteen experiences.`);

    for (const experience of transition.experiences) {
      if (ids.has(experience.id)) throw new Error(`Duplicate experience ID: ${experience.id}`);
      ids.add(experience.id);
      for (const field of requiredExperienceFields) {
        if (!experience[field]) throw new Error(`${experience.id} is missing ${field}.`);
      }
      if (!transition.states.includes(experience.state)) throw new Error(`${experience.id} references an unknown state.`);
      if (experience.options.length < 2 || experience.options.length > 5) throw new Error(`${experience.id} must provide two to five response options.`);
    }
  }

  if (ids.size !== 105) throw new Error(`Expected 105 total experiences, received ${ids.size}.`);
}
