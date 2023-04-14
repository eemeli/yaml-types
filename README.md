# yaml-types

Additional useful types for [`yaml`](https://github.com/eemeli/yaml).

## Installation and Usage

```
npm install yaml yaml-types
```

Each type (a.k.a. "tag") is available as a named export of `'yaml-types'`.
These may then be used as [custom tags](https://eemeli.org/yaml/#writing-custom-tags):

```js
import { parse } from 'yaml'
import { regexp } from 'yaml-types'

const re = parse('!re /fo./g', { customTags: [regexp] })
'foxbarfoo'.match(re) // [ 'fox', 'foo' ]
```

## Available Types

- `regexp` (`!re`) - [RegExp] values,
  using their default `/foo/flags` string representation.

[RegExp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions

## Customising Tag Names

To use one of the types with a different tag identifier, set its `tag` value accordingly.
For example, to extend the default namespace with `!!js/regexp` instead of using a locale `!re` tag for RegExp values:

```js
import { stringify } from 'yaml'
import { regexp } from 'yaml-types'

const myregexp = { ...regexp, tag: 'tag:yaml.org,2002:js/regexp' }
const str = stringify(/fo./m, { customTags: [myregexp] })
// '!!js/regexp /fo./m\n'
```

## Contributing

Additions to this library are very welcome!
Many data types are useful beyond any single project,
and while the core `yaml` library is mostly limited to the YAML spec,
no such restriction applies here.

The source code is written in [TypeScript], and the tests use [Node-Tap].
When submitting a PR for a new type, tests and documentation are required,
as well as satisfying [Prettier].

[TypeScript]: https://www.typescriptlang.org/
[Node-Tap]: https://node-tap.org/
[Prettier]: https://prettier.io/
