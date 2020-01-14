import Ember from 'ember';
import { assert } from '@ember/debug';

let pending = 0;

export function checkPending(): boolean {
  return pending === 0;
}

export default function waitForInTests(_target: any, _propertyKey: string, desc: PropertyDescriptor): void {
  assert('The @waitFor decorator must be applied to functions', desc && typeof desc.value === 'function');

  if (!Ember.testing) {
    return;
  }

  const orig = desc.value;

  desc.value = async function(...args: any[]): Promise<any> {
    pending++;
    try {
      return await orig.apply(this, args);
    } finally {
      pending--;
    }
  };
}
