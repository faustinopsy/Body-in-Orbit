import { checkInOf } from '../domain/checkIn/applyCheckIn.js';
import { initialAnswers } from '../domain/checkIn/questions.js';
import { todayOf } from '../domain/missionDay.js';

export function currentAnswers(state) {
  const day = todayOf(state.dataset);
  const draft = state.checkInDraft;
  if (draft && draft.crewId === state.crewId && draft.day === day) return draft.answers;
  return checkInOf(state.dataset, state.crewId, day)?.answers ?? initialAnswers();
}