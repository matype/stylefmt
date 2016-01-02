## v1.4.1

- Fixed [#55](https://github.com/morishitter/cssfmt/pull/55) and [#57](https://github.com/morishitter/cssfmt/pull/57)

## v1.4.0

- Format hex color code to lowercase.

## v1.3.9

- Fixed a bug

## v1.3.8

Fixed some bugs, thanks @kewah .

- [#39](https://github.com/morishitter/cssfmt/pull/39)
- [#40](https://github.com/morishitter/cssfmt/pull/40)

## v1.3.7

- Fixed [#37](https://github.com/morishitter/cssfmt/issues/37)

## v1.3.6

- Fixed [#36](https://github.com/morishitter/cssfmt/issues/36)

## v1.3.5

- Fixed [#35](https://github.com/morishitter/cssfmt/issues/35)

## v1.3.4

- Fixed [#34](https://github.com/morishitter/cssfmt/issues/34)

## v1.3.3

- Fixed [#33](https://github.com/morishitter/cssfmt/issues/33)

## v1.3.2

- Fixed [#32](https://github.com/morishitter/cssfmt/issues/32)

## v1.3.1

- Fixed [#31](https://github.com/morishitter/cssfmt/issues/31)

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

- Hanele multiline comments. [#24](https://github.com/morishitter/cssfmt/pull/24)

Thanks @kewah .

## v1.1.1

- Fix atrule for comments format

## v1.1.0

- Change to open 1 brank line between rules. [#16](https://github.com/morishitter/cssfmt/issues/16)

## v1.0.2

- Support formatting `@font-face`
 - Fix [#22](https://github.com/morishitter/cssfmt/issues/22)

## v1.0.1

- Fix [#20](https://github.com/morishitter/cssfmt/issues/20)

## v1.0.0

Major release.

- Update PostCSS to v5.0.
- Support all SCSS syntax.
 - inline comments
 - `@function`

- Fix some bugs.

## v0.8.5

- Fix a bug [#17](https://github.com/morishitter/cssfmt/issues/17)

## v0.8.4

- Fix a bug [#15](https://github.com/morishitter/cssfmt/issues/15)

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

- Fix a bug. [#9](https://github.com/morishitter/cssfmt/pull/9)

## v0.6.4

- Fix a bug. [#6](https://github.com/morishitter/cssfmt/pull/6)

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

- Changed `cssfmt()` a parameter. (filepath -> file)
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
