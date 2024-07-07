import { type CollectionTag, type ScalarTag, Schema } from 'yaml'

const tags = new Schema({ resolveKnownTags: true }).knownTags as {
  'tag:yaml.org,2002:binary': ScalarTag
  'tag:yaml.org,2002:omap': CollectionTag
  'tag:yaml.org,2002:pairs': CollectionTag
  'tag:yaml.org,2002:set': CollectionTag
  'tag:yaml.org,2002:timestamp': ScalarTag
}

export const {
  'tag:yaml.org,2002:binary': binary,
  'tag:yaml.org,2002:omap': omap,
  'tag:yaml.org,2002:pairs': pairs,
  'tag:yaml.org,2002:set': set
} = tags
export const timestamp: ScalarTag = {
  ...tags['tag:yaml.org,2002:timestamp'],
  default: false
}
