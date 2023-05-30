import { test } from 'tap'
import { Document, parse, stringify, Tags, type Scalar } from 'yaml'

import { bigint } from '.'

const customTags = (tags: Tags) => ([bigint] as Tags).concat(tags)

test('parse with n', t => {
  const res: bigint = parse(`!bigint 123n`, {
    customTags: [bigint]
  })
  t.type(res, 'bigint')
  t.equal(Number(res), 123)
  t.equal(res, 123n)
  t.end()
})

test('parse without n', t => {
  const res: bigint = parse(`!bigint 123`, { customTags })
  t.type(res, 'bigint')
  t.equal(Number(res), 123)
  t.equal(res, 123n)
  t.end()
})

test('negative zero is zero', t => {
  const pos: bigint = parse(`!bigint 0`, { customTags })
  const neg: bigint = parse(`!bigint -0`, { customTags })
  t.equal(pos, 0n, 'pos equals zero')
  t.equal(neg, 0n, 'neg equals zero')
  t.equal(pos, neg, 'pos equals neg')
  t.end()
})

test('parse hex, octal, binary', t => {
  const cases = [
    '0b11011110101011011011111011101111',
    '0B11011110101011011011111011101111',
    '0b11011110101011011011111011101111n',
    '0B11011110101011011011111011101111n',
    '0o33653337357',
    '0o33653337357n',
    '3735928559',
    '3735928559n',
    '0xDeAdBeEf',
    '0xDeAdBeEfn',
    '0xDEADBEEF',
    '0xDEADBEEFn',
    '0XDEADBEEF',
    '0XDEADBEEFn',
    '0x0000DEADBEEF',
    '0x0000DEADBEEFn',
    '0xdeadbeef',
    '0xdeadbeefn',
    '0000000003735928559'
  ]
  for (const c of cases) {
    const res: bigint = parse(`!bigint ${c}`, { customTags })
    t.equal(res, 0xdeadbeefn, `${c} value`)
    t.type(res, 'bigint', `${c} typeof`)
  }
  t.end()
})

test('parse invalid', t => {
  const opt = { customTags }
  t.throws(() => parse('!bigint not a number\n', opt))
  t.throws(() => parse('!bigint 123.456\n', opt))
  t.throws(() => parse('!bigint 123x\n', opt))
  t.throws(() => parse('!bigint 0xBAD1DEAN\n', opt), 'n must be lowercase')
  t.throws(() => parse('!bigint 0b012', opt), '2 is invalid binary digit')
  t.throws(() => parse('!bigint 0o018', opt), '8 is invalid octal digit')
  t.end()
})

test('empty string is 0n', t => {
  t.equal(parse('!bigint ""', { customTags }), 0n)
  t.end()
})

test('stringify', t => {
  const doc = new Document<Scalar, false>(123n, { customTags })
  t.equal(doc.toString(), '!bigint 123n\n')

  doc.contents.value = Object(42n)
  t.equal(doc.toString(), '!bigint 42n\n')

  doc.contents.value = 42
  t.throws(() => doc.toString(), { name: 'TypeError' })

  t.equal(
    stringify(
      [0n, 123, 123n, BigInt('123'), Object(123n), Object(BigInt(123)), -123n],
      {
        customTags
      }
    ),
    `- !bigint 0n
- 123
- !bigint 123n
- !bigint 123n
- !bigint 123n
- !bigint 123n
- !bigint -123n
`
  )

  t.end()
})
