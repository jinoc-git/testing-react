import { it, expect, describe } from 'vitest';

describe('group', () => {
  it('should', async () => {
    const res = await fetch('/categories'); // mock api fetch
    const data = await res.json();
    console.log(data);
    expect(data).toHaveLength(3);
  });
});
