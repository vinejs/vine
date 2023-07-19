/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Copy-pasted from
 * https://github.com/ts-essentials/ts-essentials/blob/3f5d46a203cad06728fbf2a089a5b39bd473bf4e/lib/camel-case/index.ts
 *
 * Since, we need just one helper, I decided to not pull in the entire package and just copy-paste
 * the types
 */

type IsStringLiteral<Type> = Type extends string ? (string extends Type ? false : true) : false

type WordInPascalCase<Type> = Capitalize<WordInCamelCase<Uncapitalize<Type & string>>>

type WordInCamelCase<
  Type,
  Character extends string = '',
> = Type extends `${Character}${infer NextCharacter}${infer _}`
  ? NextCharacter extends Capitalize<NextCharacter>
    ? Character
    : WordInCamelCase<Type, `${Character}${NextCharacter}`>
  : Character

type Separator = '_' | '-'

type IncludesSeparator<Type> = Type extends `${string}${Separator}${string}` ? true : false

type IsOneWord<Type> = Type extends Lowercase<Type & string>
  ? true
  : Type extends Uppercase<Type & string>
  ? true
  : false

type IsCamelCase<Type> = Type extends Uncapitalize<Type & string> ? true : false

type IsPascalCase<Type> = Type extends Capitalize<Type & string> ? true : false

/** snake_case, CONSTANT_CASE, kebab-case or COBOL-CASE */
type SeparatorCaseParser<
  Type,
  Tuple extends readonly any[] = [],
> = Type extends `${infer Word}${Separator}${infer Tail}`
  ? SeparatorCaseParser<Tail, [...Tuple, Lowercase<Word>]>
  : Type extends `${infer Word}`
  ? [...Tuple, Lowercase<Word>]
  : Tuple

type CamelCaseParser<Type, Tuple extends readonly any[] = []> = Type extends ''
  ? Tuple
  : Type extends `${WordInCamelCase<Type & string>}${infer Tail}`
  ? Type extends `${infer Word}${Tail}`
    ? CamelCaseParser<Uncapitalize<Tail>, [...Tuple, Lowercase<Word>]>
    : never
  : never

type PascalCaseParser<Type, Tuple extends readonly any[] = []> = Type extends ''
  ? Tuple
  : Type extends `${WordInPascalCase<Type & string>}${infer Tail}`
  ? Type extends `${infer Word}${Tail}`
    ? PascalCaseParser<Tail, [...Tuple, Lowercase<Word>]>
    : never
  : never

type SplitAnyCase<Type> = IncludesSeparator<Type> extends true
  ? SeparatorCaseParser<Type>
  : IsOneWord<Type> extends true
  ? [Lowercase<Type & string>]
  : IsCamelCase<Type> extends true
  ? CamelCaseParser<Type>
  : IsPascalCase<Type> extends true
  ? PascalCaseParser<Type>
  : []

type PascalCapitalizer<Type, Tuple extends readonly any[] = []> = Type extends [
  infer Head,
  ...infer Tail,
]
  ? Head extends string
    ? PascalCapitalizer<Tail, [...Tuple, Capitalize<Head>]>
    : PascalCapitalizer<Tail, Tuple>
  : Tuple

type CamelCapitalizer<Type> = Type extends [infer First, ...infer Tail]
  ? PascalCapitalizer<Tail, [First]>
  : []

type Join<Type, JoinedString extends string = ''> = Type extends [infer Head, ...infer Tail]
  ? Head extends string
    ? Join<Tail, `${JoinedString}${Head}`>
    : Join<Tail>
  : JoinedString

export type CamelCase<Type> = IsStringLiteral<Type> extends true
  ? Join<CamelCapitalizer<SplitAnyCase<Type>>>
  : Type
