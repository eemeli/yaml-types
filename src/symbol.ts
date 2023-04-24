import type { Scalar, ScalarTag } from 'yaml'
import { StringifyContext, stringifyString } from 'yaml/util'

export const sharedSymbol = {
  identify: value => value?.constructor === Symbol,
  tag: '!symbol/shared',
  resolve: str => Symbol.for(str),
  stringify(item: Scalar, ctx: StringifyContext, onComment, onChompKeep) {
    const key = Symbol.keyFor(item.value as symbol)
    if (key === undefined) throw new Error('Only shared symbols are supported')
    return stringifyString({ value: key }, ctx, onComment, onChompKeep)
  }
} satisfies ScalarTag
