# CSSfmt

[![Build Status](https://travis-ci.org/morishitter/cssfmt.svg)](https://travis-ci.org/morishitter/cssfmt)
[![npm package][npm-ver-link]][releases]
[![][dl-badge]][npm-pkg-link]
[![Dependency Status](https://david-dm.org/morishitter/cssfmt.svg)](https://david-dm.org/morishitter/cssfmt)
[![][mit-badge]][mit]

[![Join the chat at https://gitter.im/morishitter/cssfmt](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/morishitter/cssfmt?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[releases]:     https://github.com/morishitter/cssfmt/releases
[npm-pkg-link]: https://www.npmjs.org/package/cssfmt
[npm-ver-link]: https://img.shields.io/npm/v/cssfmt.svg?style=flat-square
[dl-badge]:     http://img.shields.io/npm/dm/cssfmt.svg?style=flat-square
[mit]:          http://opensource.org/licenses/MIT
[mit-badge]:    https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square

CSSfmt is a tool that automatically formats CSS source code, inspired by [Gofmt](https://golang.org/cmd/gofmt/), and built on top of the [PostCSS](https://github.com/postcss/postcss) ecosystem.

CSSfmt can format following code:

- Vanilla CSS
- SCSS syntax.
- Nested selectors syntax like SCSS, Less, Stylus and processor using [postcss-nested](https://github.com/postcss/postcss-nested).

CSSfmt'd code is:

- easier to **write** : never worry about minor formatting concerns while hacking away.
- easier to **read** : when all code looks the same you need not mentally convert others' formatting style into something you can understand.
- easier to **maintain** : mechanical changes to the source don't cause unrelated changes to the file's formatting; diffs show only the real changes.
- **uncontroversial** : never have a debate about spacing or brace position ever again!


## Example

### SCSS syntax

Input (input.scss):

```scss
//mixin for clearfix



        @mixin      clearfix    ()      { &:before,
  &:after {
                content:" ";
    display              : table;  }

  &:after        {clear: both;}
   }.class
{
       padding:10px;@include        clearfix();}
     .base {  color: red;  } //placeholder

%base
{


padding: 12px
}

.foo{ 
@extend      .base;}

.bar     
      {     @extend            %base;

}
```

Yield:

```scss
// mixin for clearfix
@mixin clearfix () {
  &:before,
  &:after {
    content: " ";
    display: table;
  }

  &:after {
    clear: both;
  }
}

.class {
  padding: 10px;
  @include clearfix();
}

.base {
  color: red;
}

// placeholder
%base {
  padding: 12px;
}

.foo {
  @extend .base;
}

.bar {
  @extend %base;
}
```


### Nested selectors

Input (input.css):
```css
      @media screen and (    min-width :699px)
 {.foo    +       .bar,.hoge{
    font-size   :12px      !   important   ;  ~       .fuga     {
      padding      : 10px       5px;
   color:green;
 >p

 {
        line-height             : 1.5          ;
      }}}
     }                /* comment for .class, #id */


.class,           #id
 {     color       : blue;

  border        :solid  #ddd                1px}
```

Run the following command:

```
$ cssfmt input.css
```

Yield:
```css
@media screen and (min-width: 699px) {
  .foo + .bar,
  .hoge {
    font-size: 12px !important;

    ~ .fuga {
      padding: 10px 5px;
      color: green;

      > p {
        line-height: 1.5;
      }
    }
  }
}

/* comment for .class, #id */
.class,
#id {
  color: blue;
  border: 1px solid #ddd;
}
```

## Installation

```shell
$ npm install -g cssfmt 
```

## Usage

### in Command Line

CLI Help:

```
$ cssfmt --help
```

```
Usage: cssfmt [options] input-file [output-file]

Options:

  -d, --diff        output diff against original file
  -R, --recursive   format files recursively
  -V, --versions    output the version number
  -h, --help        output usage information
```

CSSfmt can also read a file from stdin if there are no input-fle as argument in CLI.

```
$ cat input.css | cssfmt
```

### in Node.js

```js
var fs = require('fs');
var postcss = require('postcss');
var fmt = require('cssfmt');

var css = fs.readFileSync('input.css', 'utf-8');

var output = postcss()
  .use(fmt())
  .process(css)
  .css;
```

### in Task Runners

We can use CSSfmt in [Grunt](https://github.com/morishitter/grunt-cssfmt), [gulp](https://github.com/morishitter/gulp-cssfmt), and [Fly](https://github.com/morishitter/fly-cssfmt).


## Rules

### Basic

- 2 spaces indentation
- require 1 space between a simple selector and combinator
- require 1 space between selectors and `{`
- require new line after `{`
- disallow any spaces between property and `:`
- require 1 space between `:` and values
- require new line after declarations
- require `;` in last declaration
- require 1 space between values and `!important`
- disallow any spaces between `!` and `important`
- open 1 brank line between rules
- open 1 brank line between rules in atrules
- open 1 brank lines before comments
- require new line between a comment and rules
- disallow any brank lines between `@import`

### for nested selector syntax

-  open 1 line between declarations and nested rules

### SCSS

- require 1 space between `@mixin` and mixin name
- require 1 space between mixin name and `(`
- require 1 space between `@extend` and base rules
- require 1 space between `@include` and mixin name
- disallow any spaces between `$variable` and `:`
- require 1 space between `:` and name of variable

## Option projects

### Editor plugins

- [atom-cssfmt](https://github.com/1000ch/atom-cssfmt) by [@1000ch](https://github.com/1000ch)
- [cssfmt.el](https://github.com/KeenS/cssfmt.el) by [@KeenS](https://github.com/KeenS)
- [vim-cssfmt](https://github.com/kewah/vim-cssfmt) by [@kewah](https://github.com/kewah)
- [sublime-cssfmt](https://github.com/dmnsgn/sublime-cssfmt) by [@dmnsgn](https://github.com/dmnsgn)

### for Task Runners

- [grunt-cssfmt](https://github.com/morishitter/grunt-cssfmt)
- [gulp-cssfmt](https://github.com/morishitter/gulp-cssfmt)
- [fly-cssfmt](https://github.com/morishitter/fly-cssfmt)


## License

The MIT License (MIT)

Copyright (c) 2015 Masaaki Morishita
