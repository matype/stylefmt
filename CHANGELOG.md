## v6.0.0

- Use PostCSS v6
- Use yarn
- Upgrade dependencies
- Add support for *.less and *.pcss files in recursive cli mode. #301

## v5.3.2

- Update formatZeros regular expressions #286

## v5.3.1

- Fixed to remove spaces for custom at-rules #283
- Support the new param of `at-rule-empty-line-before` #284

## v5.3.0

- Support `declaration-empty-line-before` rule. #270
- Support stylelint-order v0.4.x #267
- Fixed #272

## v5.2.0

- Support `stylelint-order` plugin instead of `declaration-block-properties-order`. #263

## v5.1.2

- Prevent space between EOL and semicolon for `@value` for CSS Modules

## v5.1.1

- Bump up postcss-sorting version.

## v5.1.0

- Support `.wxss` extention. #255

## v5.0.4

- Fixed [#253](https://github.com/morishitter/stylefmt/issues/253)

## v5.0.3

- Fixed [#246](https://github.com/morishitter/stylefmt/issues/246)

## v5.0.2

- Beautify the CLI output. #241

## v5.0.1

- Fixed: `path.join()` before globby gets pathes.

## v5.0.0

- Added: globs support for `--recursive` option in CLI. #223
- Fixed: `--recursive` option in CLI, to specify files by glob e.g. `stylefmt --list /readdir/**/*.css` instead.
- Fixed: options `--diff` and `--recursive` in CLI can be used together.
- Added: `--stdin-filename` option to CLI. same as [stylelint CLI](https://github.com/stylelint/stylelint/blob/master/src/cli.js#L75)
- Added: `--ignore-path` option to CLI. same as [stylelint CLI](https://github.com/stylelint/stylelint/blob/master/src/cli.js#L63)
- Added: `ignorePath` option to Node.js API. same as [stylelint API](http://stylelint.io/user-guide/node-api/#ignorepath)
- Added: `ignoreFiles` option to configuration file. same as [stylelint configuration](http://stylelint.io/user-guide/configuration/#ignorefiles)

## v4.4.0

- Fixed [Same issue in stylelint #218](https://github.com/stylelint/stylelint/issues/1881) use `stylelint` to load configuration file.
- Fixed: `--config` option to CLI. same as [stylelint CLI](https://github.com/stylelint/stylelint/blob/master/src/cli.js#L44)
- Added: `--config-basedir` option to CLI. same as [stylelint CLI](https://github.com/stylelint/stylelint/blob/master/src/cli.js#L57)
- Fixed: `config` option to Node.js API. same as [stylelint API](http://stylelint.io/user-guide/node-api/#config)
- Added: `configBasedir` option to Node.js API. same as [stylelint API](http://stylelint.io/user-guide/node-api/#configbasedir)
- Added: `configFile` option to Node.js API. same as [stylelint API](http://stylelint.io/user-guide/node-api/#configfile)
- Added: When `stylelint` configuration file not found, it will extends from `editorconfig`: 
  - [indentation](http://stylelint.io/user-guide/rules/indentation/)
  - [no-missing-end-of-source-newline](http://stylelint.io/user-guide/rules/no-missing-end-of-source-newline/)
  - [no-eol-whitespace](http://stylelint.io/user-guide/rules/no-eol-whitespace/)
- Fixed: rules that value is an array, can work properly:
  - [at-rule-semicolon-newline-after](http://stylelint.io/user-guide/rules/at-rule-semicolon-newline-after/)
  - [block-closing-brace-newline-after](http://stylelint.io/user-guide/rules/block-closing-brace-newline-after/)
  - [block-opening-brace-newline-before](http://stylelint.io/user-guide/rules/block-opening-brace-newline-before/)
  - [block-opening-brace-space-before](http://stylelint.io/user-guide/rules/block-opening-brace-space-before/)
  - [declaration-colon-space-after](http://stylelint.io/user-guide/rules/declaration-colon-space-after/)
  - [declaration-colon-space-before](http://stylelint.io/user-guide/rules/declaration-colon-space-before/)
  - [length-zero-no-unit](http://stylelint.io/user-guide/rules/length-zero-no-unit/)
  - [number-leading-zero](http://stylelint.io/user-guide/rules/number-leading-zero/)
  - [number-no-trailing-zeros](http://stylelint.io/user-guide/rules/number-no-trailing-zeros/)
  - [selector-combinator-space-after](http://stylelint.io/user-guide/rules/selector-combinator-space-after/)
  - [selector-combinator-space-before](http://stylelint.io/user-guide/rules/selector-combinator-space-before/)
  - [selector-list-comma-newline-after](http://stylelint.io/user-guide/rules/selector-list-comma-newline-after/)
  - [selector-list-comma-newline-before](http://stylelint.io/user-guide/rules/selector-list-comma-newline-before/)
  - [selector-list-comma-space-after](http://stylelint.io/user-guide/rules/selector-list-comma-space-after/)
  - [selector-list-comma-space-before](http://stylelint.io/user-guide/rules/selector-list-comma-space-before/)
  - [shorthand-property-no-redundant-values](http://stylelint.io/user-guide/rules/shorthand-property-no-redundant-values/)

## v4.3.1

- Fixed [#208](https://github.com/morishitter/stylefmt/issues/208)

## v4.3.0

- Drop to support Node.js v0.12
- Support the following stylelint rules:
 - number-leading-zero
 - shorthand-property-no-redundant-values
 - number-no-trailing-zeros
 - number-leading-zero
 - length-zero-no-unit
 - color-hex-length
 - at-rule-empty-line-before
- Fixed some bugs

Thank you for all contributors :)

## v4.2.3

- Fixed a bug.

## v4.2.2

- Support for severities with block-closing-brace-newline-after[#173](https://github.com/morishitter/stylefmt/pull/173)
- Don't format in Sass maps
- Don't space in sass map functions

## v4.2.1

- Fixed [#170](https://github.com/morishitter/stylefmt/pull/170). [#171](https://github.com/morishitter/stylefmt/pull/171)

## v4.2.0

- Add support for string-quotes rule of stylelint. [#164](https://github.com/morishitter/stylefmt/pull/164)
- Add support for groups in declaration-block-properties and fixed [#165](https://github.com/morishitter/stylefmt/issues/165). [#167](https://github.com/morishitter/stylefmt/pull/167)

## v4.1.1

- Fixed [#162](https://github.com/morishitter/stylefmt/pull/162)

## v4.1.0

- Add support for declaration-block-properties-order rule of stylelint. [#161](https://github.com/morishitter/stylefmt/pull/161)

## v4.0.0

- Remove the default formatting rules for comments. [#158](https://github.com/morishitter/stylefmt/issues/158)

## v3.5.0

- Add `--config` option to specific configuration file

## v3.4.4

- Fixed [#150](https://github.com/morishitter/stylefmt/pull/150)

## v3.4.3

- Fixed [#87](https://github.com/morishitter/stylefmt/issues/87)

## v3.4.2

- Support `color-hex-case` rule of stylelint
- Fixed [#146](https://github.com/morishitter/stylefmt/issues/146)

## v3.4.1

- Fixed [#142](https://github.com/morishitter/stylefmt/issues/142)

## v3.4.0

Support the following stylelint rules

- declaration-colon-space-after, [#106](https://github.com/morishitter/stylefmt/issues/106)
- declaration-colon-space-before, [#107](https://github.com/morishitter/stylefmt/issues/107)

## v3.3.1

Fixed some bugs.

- [#132](https://github.com/morishitter/stylefmt/issues/132)
- [#134](https://github.com/morishitter/stylefmt/issues/134)

## v3.3.0

Add support for stylelint extends. [#129](https://github.com/morishitter/stylefmt/issues/129)

@seka implemented this feature. Thanks :) [#133](https://github.com/morishitter/stylefmt/pull/133)

## v3.2.1

Fixed the bug that occurs with `--recursive` option.

## v3.2.0

Supported the following stylelint rules

- block-closing-brace-newline
- block-closing-brace-newline-after

## v3.1.0

Implement as an asynchronouse plugin. [#85](https://github.com/morishitter/stylefmt/pull/85)

- Introduce cosmiconfig instead of rc-loader
- Fixed [#81](https://github.com/morishitter/stylefmt/issues/81)

## stylefmt v3.0.0

:tada: Renamed to stylefmt, and support to understand [stylelint](http://stylelint.io) configuration file.

- stylefmt works well with stylelint [#79](https://github.com/morishitter/stylefmt/pull/79)

@seka implemented this feature. Thanks bro :D

## v2.1.5

Fixed [#78](https://github.com/morishitter/stylefmt/issues/78)

## v2.1.4

Fixed some bugs.

- [#72](https://github.com/morishitter/stylefmt/pull/72)
- [#73](https://github.com/morishitter/stylefmt/pull/73)
- [#74](https://github.com/morishitter/stylefmt/pull/74)

## v2.1.3

Fixed some bugs.

- [#70](https://github.com/morishitter/stylefmt/pull/70)
- [#71](https://github.com/morishitter/stylefmt/pull/71)
- Do not format the value when the property is `content`

## v2.1.2

Fixed some bugs.

- [#65](https://github.com/morishitter/stylefmt/pull/65)
- [#66](https://github.com/morishitter/stylefmt/pull/66)
- [#67](https://github.com/morishitter/stylefmt/pull/67)
- [#68](https://github.com/morishitter/stylefmt/pull/68)
- [#69](https://github.com/morishitter/stylefmt/pull/69)


## v2.1.1

Fixed some bugs.

- [#63](https://github.com/morishitter/stylefmt/pull/63)
- [#64](https://github.com/morishitter/stylefmt/pull/64)

## v2.1.0

- Format properties and values to lowercase [#59](https://github.com/morishitter/stylefmt/pull/59)
- Fixe a bug [#56](https://github.com/morishitter/stylefmt/issues/56)

## v2.0.2

Fixed `var()` format

## v2.0.1

Fixed @apply rule format, @custom-selector-params

## v2.0.0

Support formatting future CSS Syntax using [cssnext](http://cssnext.io)

## v1.4.1

- Fixed [#55](https://github.com/morishitter/stylefmt/pull/55) and [#57](https://github.com/morishitter/stylefmt/pull/57)

## v1.4.0

- Format hex color code to lowercase.

## v1.3.9

- Fixed a bug

## v1.3.8

Fixed some bugs, thanks @kewah .

- [#39](https://github.com/morishitter/stylefmt/pull/39)
- [#40](https://github.com/morishitter/stylefmt/pull/40)

## v1.3.7

- Fixed [#37](https://github.com/morishitter/stylefmt/issues/37)

## v1.3.6

- Fixed [#36](https://github.com/morishitter/stylefmt/issues/36)

## v1.3.5

- Fixed [#35](https://github.com/morishitter/stylefmt/issues/35)

## v1.3.4

- Fixed [#34](https://github.com/morishitter/stylefmt/issues/34)

## v1.3.3

- Fixed [#33](https://github.com/morishitter/stylefmt/issues/33)

## v1.3.2

- Fixed [#32](https://github.com/morishitter/stylefmt/issues/32)

## v1.3.1

- Fixed [#31](https://github.com/morishitter/stylefmt/issues/31)

## v1.3.0

- Set indentation size from `.editorconfig`

## v1.2.3

- Fixed some bugs

## v1.2.2

- Fix some bugs. Thanks @yisible :)

## v1.2.1

- Support formatting pseudo-element(`::before`, `::after`)

## v1.2.0

- Support formatting `@import`
- Fix sass function format
- Introduce repeat-string package
- Fix some bugs

## v1.1.2

- Hanele multiline comments. [#24](https://github.com/morishitter/stylefmt/pull/24)

Thanks @kewah .

## v1.1.1

- Fix atrule for comments format

## v1.1.0

- Change to open 1 brank line between rules. [#16](https://github.com/morishitter/stylefmt/issues/16)

## v1.0.2

- Support formatting `@font-face`
 - Fix [#22](https://github.com/morishitter/stylefmt/issues/22)

## v1.0.1

- Fix [#20](https://github.com/morishitter/stylefmt/issues/20)

## v1.0.0

Major release.

- Update PostCSS to v5.0.
- Support all SCSS syntax.
 - inline comments
 - `@function`

- Fix some bugs.

## v0.8.5

- Fix a bug [#17](https://github.com/morishitter/stylefmt/issues/17)

## v0.8.4

- Fix a bug [#15](https://github.com/morishitter/stylefmt/issues/15)

## v0.8.3

- Support formatting comments

## v0.8.2

- Fix a bug using `--recursive` option.

## v0.8.1

- Fix a bug using `--recursive` option.

## v0.8.0

- Add `--recursive` option in CLI.

## v0.7.0

- Read file from stdin.

## v0.6.5

- Fix a bug. [#9](https://github.com/morishitter/stylefmt/pull/9)

## v0.6.4

- Fix a bug. [#6](https://github.com/morishitter/stylefmt/pull/6)

## v0.6.3

- Implement `--diff` option.

## v0.6.2

- Open 1 space after `,` in values.

## v0.6.1

- Open 1 line between rules in atrules.

## v0.6.0

Support formatting some Sass functions.

- Variables
- `@mixin`
- `@include`
- `@extend` (include `%` selector)

## v0.5.3

- Support formatting Sass Mixin.

## v0.5.2

- Support formatting `!important`.

## v0.5.1

- Remove spaces between values and semicolon.

## v0.5.0

- Support nested selector syntax like SCSS, Less, Stylus, and processor using postcss-nested.

## v0.4.0

- Can use as a PostCSS plugin.

## v0.3.0

- Changed `stylefmt()` a parameter. (filepath -> file)
- Updated package description.

## v0.2.0

- Sort values of `border` shorthand property.

## v0.1.3

- Format media queries into detail.
- Update example in README.

## v0.1.2

- Format declaration in media queries.

## v0.1.1

- Fix a CLI bug.

## v0.1.0

- Initial release.
