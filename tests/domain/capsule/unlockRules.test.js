import { describe, expect, it } from 'vitest';
import { capsuleOf, itemErrors, newlyOpened, streakOf } from '../../../src/domain/capsule/unlockRules.js';

const items = [0, 1, 2].map((order) => ({ id: order + 1, crewId: 'C01', order, kind: 'message', title: `t${order}`, text: 'hi' }));
const answered = (days) => ({ capsuleEvery: undefined, checkIns: days.map((day) => ({ crewId: 'C01', day })) });

describe('capsule unlock rules', () => {
  it('opens one item every 3 answered days by default', () => {
    expect(capsuleOf(items, answered([1, 2]), 'C01').opened).toHaveLength(0);
    const capsule = capsuleOf(items, answered([1, 2, 3, 5]), 'C01');
    expect(capsule.opened.map((item) => item.id)).toEqual([1]);
    expect(capsule.locked.map((item) => item.daysLeft)).toEqual([2, 5]);
  });

  it('follows the rhythm chosen by the administrator', () => {
    const dataset = { ...answered([1, 2]), capsuleEvery: 1 };
    expect(capsuleOf(items, dataset, 'C01').opened).toHaveLength(2);
  });

  it('tells which item the last answer opened', () => {
    expect(newlyOpened(items, answered([1, 2]), answered([1, 2, 3]), 'C01').id).toBe(1);
    expect(newlyOpened(items, answered([1]), answered([1, 2]), 'C01')).toBe(null);
  });

  it('counts the streak up to today or yesterday', () => {
    expect(streakOf(answered([3, 4, 5]), 'C01', 6)).toBe(3);
    expect(streakOf(answered([3, 5, 6]), 'C01', 6)).toBe(2);
    expect(streakOf(answered([2]), 'C01', 6)).toBe(0);
  });

  it('asks for the title, the image or the message', () => {
    expect(itemErrors({ crewId: 'C01', kind: 'image', title: ' ' })).toEqual(['title', 'image']);
    expect(itemErrors({ crewId: 'C01', kind: 'message', title: 'Hi', text: '' })).toEqual(['text']);
  });
});