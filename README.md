# CSSfmt [![Build Status](https://travis-ci.org/morishitter/cssfmt.svg)](https://travis-ci.org/morishitter/cssfmt)

CSSfmt formats CSS code.
CSSfmt is inspired by [Gofmt](http://golang.org/pkg/fmt/) and [postcss-fmt](https://github.com/hail2u/postcss-fmt).

## Installation

```shell
$ npm install cssfmt
```

## Example

Input (input.css):
```css
@media screen and (min-width    :699px)
    {
    .foo+              .bar,
.hoge   ~        .fuga>p
                         {
                           color:red;
 padding       : 10px        }}    .class    ,#id

{
        color   :blue;font-size:        12px;

      }
```

Run following command:

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
