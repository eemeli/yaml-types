import type { Scalar, ScalarTag } from 'yaml'
import { StringifyContext, stringifyString } from 'yaml/util'

/**
 * `!bigint` BigInt
 *
 * [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) values,
 * using their conventional `123n` representation.
 */
export const bigint: ScalarTag = {
  identify: (value: any) => {
    return typeof value === 'bigint' || value instanceof BigInt
  },
  tag: '!bigint',
  resolve(str: string) {
    if (str.endsWith('n')) str = str.substring(0, str.length - 1)
    return BigInt(str)
  },
  stringify(item: Scalar, ctx: StringifyContext, onComment, onChompKeep) {
    if (!bigint.identify?.(item.value)) {
      throw new TypeError(`${item.value} is not a bigint`)
    }
    const value = (item.value as BigInt).toString() + 'n'
    return stringifyString({ value }, ctx, onComment, onChompKeep)
  }
}
