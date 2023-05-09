import type { Scalar, ScalarTag } from 'yaml'
import { StringifyContext, stringifyString } from 'yaml/util'

export const sharedSymbol = {
  identify: value =>
    value?.constructor === Symbol && typeof Symbol.keyFor(value) === 'string',
  tag: '!symbol/shared',
  resolve: str => Symbol.for(str),
  stringify(item: Scalar, ctx: StringifyContext, onComment, onChompKeep) {
    const key = Symbol.keyFor(item.value as symbol)
    if (key === undefined) {
      throw new TypeError('Only shared symbols are supported')
    }
    return stringifyString({ value: key }, ctx, onComment, onChompKeep)
  }
} satisfies ScalarTag

export const symbol = {
  identify: value =>
    value?.constructor === Symbol && Symbol.keyFor(value) === undefined,
  tag: '!symbol',
  resolve: str => Symbol(str),
  stringify(item: Scalar, ctx: StringifyContext, onComment, onChompKeep) {
    const sym = item.value
    if (typeof sym !== 'symbol') throw new TypeError(`${sym} is not a symbol`)
    const value = String(sym).replace(/^Symbol\(|\)$/g, '')
    return stringifyString({ value }, ctx, onComment, onChompKeep)
  }
} satisfies ScalarTag
