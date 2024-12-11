import { isObject } from 'lodash-es';
import { $t } from '@/locales';

/**
 * Transform record to option
 *
 * @example
 *   ```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```;
 *
 * @param record
 */
export function transformRecordToOption<T extends Record<string, string>>(record: T) {
  return Object.entries(record).map(([value, label]) => ({
    value,
    label
  })) as CommonType.Option<keyof T>[];
}

/**
 * Translate options
 *
 * @param options
 */
export function translateOptions(options: CommonType.Option<string>[]) {
  return options.map(option => ({
    ...option,
    label: $t(option.label as App.I18n.I18nKey)
  }));
}

/**
 * Toggle html class
 *
 * @param className
 */
export function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className);
  }

  function remove() {
    document.documentElement.classList.remove(className);
  }

  return {
    add,
    remove
  };
}

type AnyObject = { [key: string]: any };
/** Auxiliary type: recursively make all attributes optional */
type PartialDeep<T> = {
  [P in keyof T]?: T[P] extends AnyObject ? PartialDeep<T[P]> : T[P];
};
/**
 * Deeply update base objects without adding keys that do not exist in the base.
 *
 * @example
 *   const base = {
 *   a: 1,
 *   b: {
 *   c: 2,
 *   d: 3,
 *   },
 *   e: [1, 2, 3],
 *   };
 *
 *   const updates = {
 *   a: 10,
 *   b: {
 *   c: 20,
 *   e: 30, // Does not exist in base. b, will be ignored
 *   },
 *   f: 40, // Does not exist in base. b, will be ignored
 *   e: [4, 5], // Array will be replaced
 *   };
 *
 *   const updatedBase = updateBase(base, updates);
 *
 *   console.log(updatedBase);
 *   output:
 *   {
 *   a: 10,
 *   b: {
 *   c: 20,
 *   d: 3
 *   },
 *   e: [4, 5]
 *   }
 *
 * @param base - Base object
 * @param updates - Update object
 * @returns New object, a deep copy of the base object with updates applied
 */
export function updateBase<T extends AnyObject>(base: T, updates: PartialDeep<T>): T {
  // Deep copy the base object to avoid modifying the original object
  const result: AnyObject = Array.isArray(base) ? [...base] : { ...base };

  for (const key in updates) {
    if (Object.hasOwn(base, key)) {
      const baseValue = base[key];
      const updateValue = updates[key];

      if (isObject(baseValue) && isObject(updateValue)) {
        // Recursively update nested objects
        result[key] = updateBase(baseValue, updateValue);
      } else {
        // Directly assign updates
        result[key] = updateValue;
      }
    }
    // If the key in updates does not exist in base, ignore it
  }

  return result as T;
}
