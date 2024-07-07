import { test } from 'tap'

import { binary, omap, pairs, set, timestamp } from '.'

test('tag defined', t => {
  for (const tag of [binary, omap, pairs, set, timestamp]) {
    t.type(tag, 'object', `${tag.tag} is an object`)
    t.equal(tag.default, false, `${tag.tag} is not default`)
  }
  t.end()
})
