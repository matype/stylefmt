> Modern CSS Formatter

<div align="center">
  <a href="https://github.com/morishitter/stylefmt">
    <img width=360px src="http://morishitter.github.io/stylefmt-logo.svg">
  </a>
</div>
<br>

<p align="center"><big>

</big></p>

<p align="center">
  <a href="https://travis-ci.org/morishitter/stylefmt">
    <img src="https://travis-ci.org/morishitter/stylefmt.svg"
         alt="Build Status">
  </a>

  <a href="https://www.npmjs.com/package/stylefmt">
    <img src="https://img.shields.io/npm/v/stylefmt.svg?style=flat-square"
         alt="NPM Version">
  </a>

  <a href="https://www.npmjs.org/package/stylefmt">
    <img src="https://img.shields.io/npm/dm/stylefmt.svg?style=flat-square"
         alt="Downloads">
  </a>

  <a href="https://david-dm.org/morishitter/stylefmt">
    <img src="https://david-dm.org/morishitter/stylefmt.svg"
         alt="Dependency Status">
  </a>

  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square"
         alt="License">
  </a>

  <a href="https://gitter.im/morishitter/stylefmt">
    <img src="https://badges.gitter.im/Join%20Chat.svg"
         alt="Gitter">
  </a>
</p>
<br>

stylefmt is a tool that automatically formats CSS according to [stylelint](http://stylelint.io/) rules.

stylefmt'd code is:

- easier to **write** : never worry about minor formatting concerns while hacking away.
- easier to **read** : when all code looks the same you need not mentally convert others' formatting style into something you can understand.
- easier to **maintain** : mechanical changes to the source don't cause unrelated changes to the file's formatting; diffs show only the real changes.
- **uncontroversial** : never have a debate about spacing or brace position ever again!

## Features

- **Supports the latest CSS syntax:** Including custom properties, range context for media features, `calc()` and nesting.
- **Understands CSS-like syntaxes:** stylefmt is powered by [PostCSS](https://github.com/postcss/postcss), so it understands any syntax that PostCSS can parse, including SCSS.
- **Works well with stylelint:** [stylelint](http://stylelint.io/) is a mighty, modern CSS linter. stylefmt can understand the formatting rules specified in your stylelint configuration file (`.stylelintrc`).

## Examples

### Future CSS syntax (cssnext)

Input (input.css):

```css
/* custom properties */
:root{--fontSize: 1rem;
  --mainColor       :#12345678;
--highlightColor:hwb(190, 35%, 20%);
}

/* custom media queries */
@custom-media

--viewport-medium(width<=50rem);

/* some var() & calc() */
body{color:var(--mainColor);
    font-size:var(--fontSize);
 line-height: calc(var(--fontSize) * 1.5);
padding: calc((var(--fontSize) / 2) + 1px)}

/* custom media query usage */
@media (--viewport-medium) {
body {font-size: calc(var(--fontSize) * 1.2); }
}

/* custom selectors */
@custom-selector :--heading h1,h2,h3,    h4,h5,h6;
:--heading { margin-top:0 }

/* colors stuff */
a{
color:var(--highlightColor);
    transition:color 1s;
}
a:hover{color  :gray(255,50%) }
a:active{color : rebeccapurple }
a:any-link { color:color(var(--highlightColor) blackness(+20%)) }

/* font stuff */
h2 {font-variant-caps:small-caps;
}table{font-variant-numeric: lining-nums;
}

/* filters */
.blur{filter:blur(4px)}.sepia{
filter: sepia(.8);}

```

Yield:

```css
/* custom properties */
:root {
  --fontSize: 1rem;
  --mainColor: #12345678;
  --highlightColor: hwb(190, 35%, 20%);
}

/* custom media queries */
@custom-media --viewport-medium (width <= 50rem);

/* some var() & calc() */
body {
  color: var(--mainColor);
  font-size: var(--fontSize);
  line-height: calc(var(--fontSize) * 1.5);
  padding: calc((var(--fontSize) / 2) + 1px);
}

/* custom media query usage */
@media (--viewport-medium) {
  body {
    font-size: calc(var(--fontSize) * 1.2);
  }
}

/* custom selectors */
@custom-selector :--heading h1, h2, h3, h4, h5, h6;

:--heading {
  margin-top: 0;
}

/* colors stuff */
a {
  color: var(--highlightColor);
  transition: color 1s;
}

a:hover {
  color: gray(255, 50%);
}

a:active {
  color: rebeccapurple;
}

a:any-link {
  color: color(var(--highlightColor) blackness(+20%));
}

/* font stuff */
h2 {
  font-variant-caps: small-caps;
}

table {
  font-variant-numeric: lining-nums;
}

/* filters */
.blur {
  filter: blur(4px);
}

.sepia {
  filter: sepia(.8);
}

```

### SCSS syntax

Input (input.scss):

```scss
// mixin for clearfix


        @mixin      clearfix    ()      { &:before,
  &:after {
                content:" ";
    display              : table;  }

  &:after        {clear: both;}
   }.class
{
       padding:10px;@include        clearfix();}
     .base {  color: red;  }

// placeholder
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

## Installation

```shell
$ npm install stylefmt
```

## Usage

### in Command Line

CLI Help:

```
$ stylefmt --help
```

```
Usage: stylefmt [options] input-name [output-name]

Options:

  -b, --config-basedir   Path to the directory that relative paths defining "extends"
  -c, --config           Path to a specific configuration file (JSON, YAML, or CommonJS)
  -d, --diff             Output diff against original file
  -r, --recursive        Format list of space seperated files(globs) in place
  -v, --version          Output the version number
  -h, --help             Output usage information
  -i, --ignore-path      Path to a file containing patterns that describe files to ignore.
  --stdin-filename       A filename to assign stdin input.
```

stylefmt can also read a file from stdin if there are no input-file as argument in CLI.

```
$ cat input.css | stylefmt --stdin-filename input.css
```

### in Node.js

```js
var fs = require('fs');
var postcss = require('postcss');
var scss = require('postcss-scss'); // when you use scss syntax
var stylefmt = require('stylefmt');

var css = fs.readFileSync('input.css', 'utf-8');

postcss([
  stylefmt
]).process(css, {
    from: 'input.css',
    syntax: scss
  })
  .then(function (result) {
    result.css; // formatted code
  });
```

### in Task Runners

We can use stylefmt in [Grunt](https://github.com/morishitter/grunt-stylefmt), [gulp](https://github.com/morishitter/gulp-stylefmt), and [Fly](https://github.com/morishitter/fly-cssfmt).


## stylelint rules that stylefmt can handle

stylefmt :heart: stylelint

stylefmt supports the following stylelint rules:

- [at-rule-empty-line-before](https://github.com/stylelint/stylelint/tree/master/lib/rules/at-rule-empty-line-before) ("always"|"never" and except "blockless-group" only)
- [at-rule-semicolon-newline-after](https://github.com/stylelint/stylelint/tree/master/lib/rules/at-rule-semicolon-newline-after)
- [block-closing-brace-newline-after](https://github.com/stylelint/stylelint/tree/master/lib/rules/block-closing-brace-newline-after)
- [block-closing-brace-newline-before](https://github.com/stylelint/stylelint/tree/master/lib/rules/block-closing-brace-newline-before)
- [block-opening-brace-newline-after](https://github.com/stylelint/stylelint/tree/master/lib/rules/block-opening-brace-newline-after)
- [block-opening-brace-newline-before](https://github.com/stylelint/stylelint/tree/master/lib/rules/block-opening-brace-newline-before)
- [block-opening-brace-space-after](https://github.com/stylelint/stylelint/tree/master/lib/rules/block-opening-brace-space-after)
- [block-opening-brace-space-before](https://github.com/stylelint/stylelint/tree/master/lib/rules/block-opening-brace-space-before)
- [color-hex-case](https://github.com/stylelint/stylelint/tree/master/lib/rules/color-hex-case)
- [color-hex-length](https://github.com/stylelint/stylelint/tree/master/lib/rules/color-hex-length)
- [declaration-block-properties-order](https://github.com/stylelint/stylelint/tree/master/lib/rules/declaration-block-properties-order)
- [declaration-colon-space-after](https://github.com/stylelint/stylelint/tree/master/lib/rules/declaration-colon-space-after)
- [declaration-colon-space-before](https://github.com/stylelint/stylelint/tree/master/lib/rules/declaration-colon-space-before)
- [declaration-empty-line-before](https://github.com/stylelint/stylelint/tree/master/lib/rules/declaration-empty-line-before)
- [indentation](https://github.com/stylelint/stylelint/tree/master/lib/rules/indentation)
- [length-zero-no-unit](https://github.com/stylelint/stylelint/tree/master/lib/rules/length-zero-no-unit)
- [number-leading-zero](https://github.com/stylelint/stylelint/tree/master/lib/rules/number-leading-zero)
- [number-no-trailing-zeros](https://github.com/stylelint/stylelint/tree/master/lib/rules/number-no-trailing-zeros)
- [selector-combinator-space-after](https://github.com/stylelint/stylelint/tree/master/lib/rules/selector-combinator-space-after)
- [selector-combinator-space-before](https://github.com/stylelint/stylelint/tree/master/lib/rules/selector-combinator-space-before)
- [selector-list-comma-newline-after](https://github.com/stylelint/stylelint/tree/master/lib/rules/selector-list-comma-newline-after)
- [selector-list-comma-newline-before](https://github.com/stylelint/stylelint/tree/master/lib/rules/selector-list-comma-newline-before)
- [selector-list-comma-space-after](https://github.com/stylelint/stylelint/tree/master/lib/rules/selector-list-comma-space-after)
- [selector-list-comma-space-before](https://github.com/stylelint/stylelint/tree/master/lib/rules/selector-list-comma-space-before)
- [shorthand-property-no-redundant-values](https://github.com/stylelint/stylelint/tree/master/lib/rules/shorthand-property-no-redundant-values)
- [string-quotes](https://github.com/stylelint/stylelint/tree/master/lib/rules/string-quotes)

and we can also format from the other stylelint's configration files or packages (e.g. [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard), [stylelint-config-suitcss](https://github.com/suitcss/stylelint-config-suitcss) and so on) using `extends` property.

## Default formatting rules (without stylelint config file)

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
- leave 1 blank line between rules
- leave 1 blank line between rules in atrules
- disallow any blank lines between `@import`

### for nested selector syntax

-  leave 1 line between declarations and nested rules

### SCSS

- require 1 space between `@mixin` and mixin name
- require 1 space between mixin name and `(`
- require 1 space between `@extend` and base rules
- require 1 space between `@include` and mixin name
- disallow any spaces between `$variable` and `:`
- require 1 space between `:` and name of variable

## Option projects

### Editor plugins

- [sublime-stylefmt](https://github.com/dmnsgn/sublime-stylefmt) by [@dmnsgn](https://github.com/dmnsgn)
- [atom-stylefmt](https://github.com/1000ch/atom-stylefmt) by [@1000ch](https://github.com/1000ch)
- [vim-stylefmt](https://github.com/kewah/vim-stylefmt) by [@kewah](https://github.com/kewah)
- [stylefmt.el](https://github.com/KeenS/stylefmt.el) by [@KeenS](https://github.com/KeenS)
- [vscode-stylefmt](https://github.com/mrmlnc/vscode-stylefmt) by [@mrmlnc](https://github.com/mrmlnc)

### for Task Runners

- [gulp-stylefmt](https://github.com/morishitter/gulp-stylefmt)
- [grunt-stylefmt](https://github.com/morishitter/grunt-stylefmt)
- [fly-stylefmt](https://github.com/morishitter/fly-cssfmt)
- [laravel-elixir-stylefmt](https://github.com/appleboy/laravel-elixir-cssfmt) by [@appleboy](https://github.com/appleboy)
- [stylefmt-loader](https://github.com/tomasAlabes/stylefmt-loader) by [@tomasAlabes](https://github.com/tomasAlabes)

## License

The MIT License (MIT)

Copyright (c) 2015 Masaaki Morishita
