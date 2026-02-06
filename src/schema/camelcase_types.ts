/*
 * @vinejs/vine
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Type utilities for converting string types to camelCase at the TypeScript type level.
 * This module provides advanced type-level string manipulation for converting snake_case
 * and kebab-case property names to camelCase when using the toCamelCase option.
 *
 * Credit - https://blog.beraliv.dev/2022-07-14-camel-case
 */

/**
 * Supported separator characters for parsing string literals.
 * Matches underscore (snake_case) and hyphen (kebab-case) separators.
 */
type Separator = '_' | '-'

/**
 * Filters out empty word strings from the word array to prevent
 * trailing/leading empty strings in the parsed result.
 */
type FilterEmptyWord<Word, T extends unknown[], S extends 'start' | 'end'> = Word extends ''
  ? T
  : {
      start: [Word, ...T]
      end: [...T, Word]
    }[S]

/**
 * Splits a string literal type into an array of words by separator characters.
 * Recursively parses string from left to right, extracting words between separators.
 */
type SplitBySeparator<S> = S extends `${infer Word}${Separator}${infer Rest}`
  ? FilterEmptyWord<Word, SplitBySeparator<Rest>, 'start'>
  : FilterEmptyWord<S, [], 'start'>

/**
 * Checks if the current character is a repeated separator that should be skipped.
 * Prevents double separators like '__' or '--' from creating empty words.
 */
type IsRepeatedSeparator<Ch, Validated> = Ch extends Separator
  ? Validated extends `${string}${Separator}`
    ? true
    : false
  : false

/**
 * Removes repeated separator characters from a string literal type.
 * Ensures consecutive separators are treated as a single separator.
 */
type RemoveRepeatedSeparator<
  NotValidated,
  Validated = '',
> = NotValidated extends `${infer Ch}${infer Rest}`
  ? IsRepeatedSeparator<Ch, Validated> extends true
    ? RemoveRepeatedSeparator<Rest, Validated>
    : RemoveRepeatedSeparator<Rest, `${Validated & string}${Ch}`>
  : Validated

/**
 * Type guard to check if a character is uppercase.
 * Used to identify word boundaries in PascalCase and camelCase strings.
 */
type IsUppercase<Ch extends string> = [Ch] extends [Uppercase<Ch>] ? true : false

/**
 * Splits a PascalCase or camelCase string into an array of words by detecting
 * capital letter boundaries. Accumulates characters into words until an uppercase
 * letter is encountered.
 */
type SplitByCapital<
  S,
  Word extends string = '',
  RemainingWords extends unknown[] = [],
> = S extends ''
  ? FilterEmptyWord<Word, RemainingWords, 'end'>
  : S extends `${infer Ch}${infer Rest}`
    ? IsUppercase<Ch> extends true
      ? SplitByCapital<Rest, Ch, FilterEmptyWord<Word, RemainingWords, 'end'>>
      : SplitByCapital<Rest, `${Word}${Ch}`, RemainingWords>
    : []

/**
 * Determines which parsing strategy to use based on the string format.
 * Returns 'separatorBased' for snake_case/kebab-case, 'capitalBased' for PascalCase/camelCase.
 */
type WhichApproach<S> = S extends `${string}${Separator}${string}`
  ? 'separatorBased'
  : 'capitalBased'

/**
 * Extracts an array of word strings from a string literal type using the
 * appropriate parsing strategy (separator-based or capital-based).
 */
type Words<S> = {
  separatorBased: SplitBySeparator<RemoveRepeatedSeparator<S>>
  capitalBased: IsUppercase<S & string> extends true ? [S] : SplitByCapital<S>
}[WhichApproach<S>]

/**
 * Converts a word to the specified case (PascalCase or lowercase).
 * Used for transforming individual words before joining.
 */
type WordCase<S, C extends 'pascal' | 'lower'> = {
  pascal: Capitalize<WordCase<S, 'lower'> & string>
  lower: Lowercase<S & string>
}[C]

/**
 * Converts an array of words to PascalCase by capitalizing each word.
 * Recursively processes each word in the array.
 */
type PascalCasify<T, R extends unknown[] = []> = T extends [infer Head, ...infer Rest]
  ? PascalCasify<Rest, [...R, WordCase<Head, 'pascal'>]>
  : R

/**
 * Converts an array of words to camelCase by lowercasing the first word
 * and capitalizing all subsequent words.
 */
type CamelCasify<T> = T extends [infer Head, ...infer Rest]
  ? PascalCasify<Rest, [WordCase<Head, 'lower'>]>
  : []

/**
 * Joins an array of word strings into a single concatenated string.
 * Recursively concatenates each word from left to right.
 */
type Join<T, S extends string = ''> = T extends [infer Word, ...infer Rest]
  ? Join<Rest, `${S}${Word & string}`>
  : S

/**
 * Converts a string literal type to camelCase at the type level.
 * Supports conversion from snake_case, kebab-case, PascalCase, and camelCase inputs.
 *
 * @template S - The string literal type to convert
 *
 * @example
 * type Result1 = CamelCase<'user_name'> // 'userName'
 * type Result2 = CamelCase<'first-name'> // 'firstName'
 * type Result3 = CamelCase<'FirstName'> // 'firstName'
 */
export type CamelCase<S extends string> = Join<CamelCasify<Words<S>>>
