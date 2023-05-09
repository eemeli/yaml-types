import { Scalar, ScalarTag } from 'yaml'
import { stringifyString } from 'yaml/util'

const options: { defaultType: Scalar.Type } = {
  defaultType: 'BLOCK_LITERAL'
}

/**
 * `!function` A YAML representation of JavaScript functions
 *
 * Stringified as a block literal string, prefixed with the function name.
 *
 * When parsing, a no-op function with matching name and toString() is
 * returned. It is not possible to construct an actual JavaScript function by
 * evaluating YAML, and it is unsafe to attempt.
 */
export const functionTag = {
  identify: value => typeof value === 'function',
  tag: '!function',
  resolve(str) {
    const src = str.split('\n')
    const n = src.shift()
    const name = n ? JSON.parse(n) : undefined
    const code = src.join('\n')
    const f = function () {}
    Object.defineProperty(f, 'name', {
      value: name,
      enumerable: false,
      configurable: true
    })
    f.toString = () => code
    return f
  },
  options,
  stringify(i, ctx, onComment, onChompKeep) {
    const { type: originalType, value: originalValue } = i
    const fn = originalValue as (...a: any[]) => any
    const value = JSON.stringify(fn.name) + '\n' + fn.toString()
    // better to just always put functions on a new line.
    const type: Scalar.Type = originalType || options.defaultType
    return stringifyString({ ...i, type, value }, ctx, onComment, onChompKeep)
  }
} satisfies ScalarTag & { options: typeof options }
