# CSSfmt

[![Build Status](https://travis-ci.org/morishitter/cssfmt.svg)](https://travis-ci.org/morishitter/cssfmt)
[![npm package][npm-ver-link]][releases]
[![][dl-badge]][npm-pkg-link]

[releases]:     https://github.com/morishitter/cssfmt/releases
[npm-pkg-link]: https://www.npmjs.org/package/cssfmt
[npm-ver-link]: https://img.shields.io/npm/v/cssfmt.svg?style=flat-square
[dl-badge]:     http://img.shields.io/npm/dm/cssfmt.svg?style=flat-square

CSSfmt is a tool that automatically formats CSS source code, inspired by [Gofmt](http://golang.org/pkg/fmt/).

CSSfmt'd code is:

- easier to **write** : never worry about minor formatting concerns while hacking away.
- easier to **read** : when all code looks the same you need not mentally convert others' formatting style into something you can understand.
- easier to **maintain** : mechanical changes to the source don't cause unrelated changes to the file's formatting; diffs show only the real changes.
- **uncontroversial** : never have a debate about spacing or brace position ever again!

## Installation

```shell
$ npm install cssfmt
```

## Example

Input (input.css):
```css
  @media screen and(     min-width    :699px  )
    {
    .foo+              .bar,
.hoge   ~        .fuga>p
                         {
                           color:red;
 padding       : 10px        }}    .class    ,#id

{
        color   :blue;font-size:        12px;

border     :#ddd        solid      1px

      }
```

Run the following command:

```
$ cssfmt input.css
```

Yield:
```css
@media screen and (min-width: 699px) {
  .foo + .bar,
  .hoge ~ .fuga > p {
    color: red;
    padding: 10px;
  }
}

.class,
#id {
  color: blue;
  font-size: 12px;
  border: 1px solid #ddd;
}
```

## Rules

- 2 spaces indentation
- require 1 space between simple selector and combinator
- require 1 space between selector and `{`
- require new line after `{`
- disallow any spaces between property and `:`
- require 1 space between `:` and values
- require new line after declarations
- require `;` in last declaration
- require new line after rules


## License

The MIT License (MIT)

Copyright (c) 2015 Masaaki Morishita
