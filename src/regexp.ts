import type { ScalarTag } from 'yaml'

/**
 * `!re` RegExp
 *
 * [Regular Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) values,
 * using their default `/foo/flags` string representation.
 */
export const regexp = {
  identify: value => value instanceof RegExp,
  tag: '!re',
  resolve(str: string) {
    const match = str.match(/^\/([\s\S]+)\/([dgimsuy]*)$/)
    if (!match) throw new Error('Invalid RegExp value')
    return new RegExp(match[1], match[2])
  }
} satisfies ScalarTag
