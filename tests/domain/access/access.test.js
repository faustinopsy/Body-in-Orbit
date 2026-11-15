import { describe, expect, it } from 'vitest';
import { canOpen, routesFor, validUser, visibleCrew } from '../../../src/domain/access/permissions.js';
import { crewAccountId, passwordErrors, userOf } from '../../../src/domain/access/accounts.js';

const dataset = { demo: false, crew: [{ id: 'C01' }, { id: 'C02' }] };

describe('access rules', () => {
  it('opens settings only for the administrator', () => {
    expect(routesFor({ role: 'admin' })).toContain('settings');
    expect(canOpen({ role: 'crew', crewId: 'C01' }, 'settings')).toBe(false);
    expect(canOpen({ role: 'crew', crewId: 'C01' }, 'today')).toBe(true);
    expect(routesFor(null)).toEqual([]);
  });

  it('shows a crew member only their own data', () => {
    expect(visibleCrew({ role: 'crew', crewId: 'C02' }, dataset.crew)).toEqual([{ id: 'C02' }]);
    expect(visibleCrew({ role: 'admin' }, dataset.crew)).toHaveLength(2);
  });

  it('drops demo users outside the demo and crew members of another mission', () => {
    expect(validUser({ role: 'admin', demo: true }, dataset)).toBe(null);
    expect(validUser({ role: 'crew', crewId: 'C09' }, dataset)).toBe(null);
    expect(validUser({ role: 'crew', crewId: 'C01' }, dataset)).toEqual({ role: 'crew', crewId: 'C01' });
  });

  it('checks the password size and the repetition', () => {
    expect(passwordErrors('12345')).toEqual(['short']);
    expect(passwordErrors('123456', '123457')).toEqual(['mismatch']);
    expect(passwordErrors('123456', '123456')).toEqual([]);
    expect(userOf('C03')).toEqual({ role: 'crew', crewId: 'C03' });
    expect(crewAccountId(4, 'C01')).toBe('crew:4:C01');
  });
});