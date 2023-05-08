import { CollectionTag, YAMLMap } from 'yaml'
import { ToJSContext } from 'yaml/util'

const tag = '!nullobject'

class YAMLNullObject extends YAMLMap {
  tag = tag
  toJSON(_: unknown, ctx: ToJSContext): any {
    const obj = super.toJSON(_, { ...ctx, mapAsMap: false })
    return Object.assign(Object.create(null), obj)
  }
}

/**
 * `!nullobject` An object with a `null` prototype
 */
export const nullobject = {
  tag,
  collection: 'map',
  nodeClass: YAMLNullObject,
  identify: v => !!(typeof v === 'object' && v && !Object.getPrototypeOf(v))
} satisfies CollectionTag
