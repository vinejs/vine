import { requiredWhen } from './rules.js'
import { helpers } from '../../vine/helpers.js'
import type {
  Validation,
  RuleBuilder,
  FieldContext,
  ComparisonOperators,
  ArrayComparisonOperators,
  NumericComparisonOperators,
} from '../../types.js'

/**
 * Set of conditional rules to mark a field as required using
 * runtime checks
 */
export abstract class ConditionalValidations {
  abstract use(validation: Validation<any> | RuleBuilder): this

  /**
   * Define a callback to conditionally require a field at
   * runtime.
   *
   * The callback method should return "true" to mark the
   * field as required, or "false" to skip the required
   * validation
   */
  requiredWhen<Operator extends ComparisonOperators>(
    otherField: string,
    operator: Operator,
    expectedValue: Operator extends ArrayComparisonOperators
      ? (string | number | boolean)[]
      : Operator extends NumericComparisonOperators
        ? number
        : string | number | boolean
  ): this
  requiredWhen(callback: (field: FieldContext) => boolean): this
  requiredWhen(
    otherField: string | ((field: FieldContext) => boolean),
    operator?: ComparisonOperators,
    expectedValue?: any
  ) {
    /**
     * The equality check if self implemented
     */
    if (typeof otherField === 'function') {
      return this.use(requiredWhen(otherField))
    }

    /**
     * Creating the checker function based upon the
     * operator used for the comparison
     */
    let checker: (value: any) => boolean
    switch (operator!) {
      case '=':
        checker = (value) => value === expectedValue
        break
      case '!=':
        checker = (value) => value !== expectedValue
        break
      case 'in':
        checker = (value) => expectedValue.includes(value)
        break
      case 'notIn':
        checker = (value) => !expectedValue.includes(value)
        break
      case '>':
        checker = (value) => value > expectedValue
        break
      case '<':
        checker = (value) => value < expectedValue
        break
      case '>=':
        checker = (value) => value >= expectedValue
        break
      case '<=':
        checker = (value) => value <= expectedValue
    }

    /**
     * Registering rule with custom implementation
     */
    return this.use(
      requiredWhen((field) => {
        const otherFieldValue = helpers.getNestedValue(otherField, field)
        return checker(otherFieldValue)
      })
    )
  }

  /**
   * Mark the field under validation as required when all
   * the other fields are present with value other
   * than `undefined` or `null`.
   */
  requiredIfExists(fields: string | string[]) {
    const fieldsToExist = Array.isArray(fields) ? fields : [fields]
    return this.use(
      requiredWhen((field) => {
        return fieldsToExist.every((otherField) => {
          return helpers.exists(helpers.getNestedValue(otherField, field))
        })
      })
    )
  }

  /**
   * Mark the field under validation as required when any
   * one of the other fields are present with non-nullable
   * value.
   */
  requiredIfAnyExists(fields: string[]) {
    return this.use(
      requiredWhen((field) => {
        return fields.some((otherField) =>
          helpers.exists(helpers.getNestedValue(otherField, field))
        )
      })
    )
  }

  /**
   * Mark the field under validation as required when all
   * the other fields are missing or their value is
   * `undefined` or `null`.
   */
  requiredIfMissing(fields: string | string[]) {
    const fieldsToExist = Array.isArray(fields) ? fields : [fields]
    return this.use(
      requiredWhen((field) => {
        return fieldsToExist.every((otherField) =>
          helpers.isMissing(helpers.getNestedValue(otherField, field))
        )
      })
    )
  }

  /**
   * Mark the field under validation as required when any
   * one of the other fields are missing.
   */
  requiredIfAnyMissing(fields: string[]) {
    return this.use(
      requiredWhen((field) => {
        return fields.some((otherField) =>
          helpers.isMissing(helpers.getNestedValue(otherField, field))
        )
      })
    )
  }
}
