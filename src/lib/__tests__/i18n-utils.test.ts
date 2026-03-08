import { describe, it, expectTypeOf } from 'vitest';
import type { DynamicTranslate } from '@/lib/i18n-utils';

describe('DynamicTranslate type', () => {
  it('accepts a string key and returns a string', () => {
    expectTypeOf<DynamicTranslate>().toBeFunction();
    expectTypeOf<DynamicTranslate>().parameters.toMatchTypeOf<[string, (Record<string, string | number>)?]>();
    expectTypeOf<DynamicTranslate>().returns.toBeString();
  });

  it('is callable with dynamic runtime keys', () => {
    const t: DynamicTranslate = (key: string) => `translated:${key}`;
    expectTypeOf(t).toMatchTypeOf<DynamicTranslate>();
  });
});
