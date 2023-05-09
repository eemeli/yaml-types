import { Scalar, ScalarTag } from 'yaml'
import { stringifyString } from 'yaml/util'

const options: { defaultType: Scalar.Type } = {
  defaultType: 'BLOCK_LITERAL'
}

/**
 * `!class` A YAML representation of JavaScript classes
 *
 * Stringified as a block literal string, prefixed with the class name.
 *
 * When parsing, a no-op class with matching name and toString() is
 * returned. It is not possible to construct an actual JavaScript class by
 * evaluating YAML, and it is unsafe to attempt.
 */
export const classTag = {
  identify(value) {
    const cls = value as { new (): any }
    try {
      return typeof value === 'function' && Boolean(class extends cls {})
    } catch {
      return false
    }
  },
  tag: '!class',
  resolve(str) {
    const f = class {}
    f.toString = () => str
    const m = str.trim().match(/^class(?:\s+([^{ \s]*?)[{\s])/)
    Object.defineProperty(f, 'name', {
      value: m?.[1],
      enumerable: false,
      configurable: true,
      writable: true
    })
    return f
  },
  options,
  stringify(i, ctx, onComment, onChompKeep) {
    const { type: originalType, value: originalValue } = i
    const cls = originalValue as { new (...a: any[]): any }
    const value = cls.toString()
    // better to just always put classes on a new line.
    const type: Scalar.Type = originalType || options.defaultType
    return stringifyString({ ...i, type, value }, ctx, onComment, onChompKeep)
  }
} satisfies ScalarTag & { options: typeof options }
