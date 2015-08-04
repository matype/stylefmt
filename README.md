# cssfmt [![Build Status](https://travis-ci.org/morishitter/cssfmt.svg)](https://travis-ci.org/morishitter/cssfmt)

CSSfmt formats CSS code.

## Installation

```shell
$ npm install cssfmt
```

## Example

Input (input.css):
```css
@media screen and (min-width: 699px) {
    .foo+              .bar,
.hoge   ~        .fuga>p {
                           color:red;
 padding       : 10px;
}
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
  .hoge ~ .fuga + p {
    color: red;
    padding: 10px;
  }
}
```


## License

The MIT License (MIT)

Copyright (c) 2015 Masaaki Morishita
