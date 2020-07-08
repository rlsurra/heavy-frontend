import lodashMemoize from 'lodash/memoize';
import format from 'date-fns/format';

/* eslint-disable no-underscore-dangle */
/* @link http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line no-useless-escape

const isEmpty = (value: any) =>
    typeof value === 'undefined' ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

export interface ValidationErrorMessageWithArgs {
    message: string;
    args: {
        [key: string]: ValidationErrorMessageWithArgs | any;
    };
}

export type ValidationErrorMessage = string | ValidationErrorMessageWithArgs;

export type Validator = (
    value: any,
    values: any,
    props: any
) => ValidationErrorMessage | null | undefined;

interface MessageFuncParams {
    args: any;
    value: any;
    values: any;
}

type MessageFunc = (params: MessageFuncParams) => ValidationErrorMessage;

const getMessage = (
    message: string | MessageFunc,
    messageArgs: any,
    value: any,
    values: any
) =>
    typeof message === 'function'
        ? message({
              args: messageArgs,
              value,
              values,
          })
        : messageArgs
        ? {
              message,
              args: messageArgs,
          }
        : message;

type Memoize = <T extends (...args: any[]) => any>(
    func: T,
    resolver?: (...args: any[]) => any
) => T;

// If we define validation functions directly in JSX, it will
// result in a new function at every render, and then trigger infinite re-render.
// Hence, we memoize every built-in validator to prevent a "Maximum call stack" error.
const memoize: Memoize = (fn: any) =>
    lodashMemoize(fn, (...args) => JSON.stringify(args));

// Compose multiple validators into a single one for use with final-form
export const composeValidators = (...validators) => (value, values, meta) => {
    const allValidators = Array.isArray(validators[0])
        ? validators[0]
        : validators;

    return allValidators.reduce(
        (error, validator) =>
            error ||
            (typeof validator === 'function' && validator(value, values, meta)),
        undefined
    );
};

/**
 * Required validator
 *
 * Returns an error if the value is null, undefined, or empty
 *
 * @param {string|function} message
 *
 * @example
 *
 * const titleValidators = [required('The title is required')];
 * <TextInput name="title" validate={titleValidators} />
 */
export const required = memoize((message = 'ra.validation.required') =>
    Object.assign(
        (value, values) =>
            isEmpty(value)
                ? getMessage(message, undefined, value, values)
                : undefined,
        { isRequired: true }
    )
);

/**
 * Minimum length validator
 *
 * Returns an error if the value has a length less than the parameter
 *
 * @param {integer} min
 * @param {string|function} message
 *
 * @example
 *
 * const passwordValidators = [minLength(10, 'Should be at least 10 characters')];
 * <TextInput type="password" name="password" validate={passwordValidators} />
 */
export const minLength = memoize(
    (min, message = 'ra.validation.minLength') => (value, values) =>
        !isEmpty(value) && value.length < min
            ? getMessage(message, { min }, value, values)
            : undefined
);

/**
 * Maximum length validator
 *
 * Returns an error if the value has a length higher than the parameter
 *
 * @param {integer} max
 * @param {string|function} message
 *
 * @example
 *
 * const nameValidators = [maxLength(10, 'Should be at most 10 characters')];
 * <TextInput name="name" validate={nameValidators} />
 */
export const maxLength = memoize(
    (max, message = 'ra.validation.maxLength') => (value, values) =>
        !isEmpty(value) && value.length > max
            ? getMessage(message, { max }, value, values)
            : undefined
);

/**
 * Minimum validator
 *
 * Returns an error if the value is less than the parameter
 *
 * @param {integer} min
 * @param {string|function} message
 *
 * @example
 *
 * const fooValidators = [minValue(5, 'Should be more than 5')];
 * <NumberInput name="foo" validate={fooValidators} />
 */
export const minValue = memoize(
    (min, message = 'ra.validation.minValue') => (value, values) =>
        !isEmpty(value) && value < min
            ? getMessage(message, { min }, value, values)
            : undefined
);

/**
 * Maximum validator
 *
 * Returns an error if the value is higher than the parameter
 *
 * @param {integer} max
 * @param {string|function} message
 *
 * @example
 *
 * const fooValidators = [maxValue(10, 'Should be less than 10')];
 * <NumberInput name="foo" validate={fooValidators} />
 */
export const maxValue = memoize(
    (max, message = 'ra.validation.maxValue') => (value, values) =>
        !isEmpty(value) && value > max
            ? getMessage(message, { max }, value, values)
            : undefined
);

/**
 * Minimal Date validator
 *
 * Returns an error if the value is before the parameter date
 *
 * @param {string} min
 * @param {string|function} message
 *
 * @example
 *
 * const fooValidators = [minDate(new Date(), 'Should be after today')];
 * <DateInput name="foo" validate={fooValidators} />
 */
export const minDate = memoize(
    (min, message = 'ra.validation.minDate', formatString = 'yyyy-MM-dd') => (
        value,
        values
    ) => {
        return !isEmpty(value) && new Date(value) < new Date(min)
            ? getMessage(
                  message,
                  { min: format(new Date(min), formatString) },
                  value,
                  values
              )
            : undefined;
    }
);

/**
 * Maximum Date validator
 *
 * Returns an error if the value is after the parameter date
 *
 * @param {string} max
 * @param {string|function} message
 *
 * @example
 *
 * const fooValidators = [maxDate(new Date(), 'Should be before today')];
 * <DateInput name="foo" validate={fooValidators} />
 */
export const maxDate = memoize(
    (max, message = 'ra.validation.maxDate', formatString = 'yyyy-MM-dd') => (
        value,
        values
    ) => {
        return !isEmpty(value) && new Date(value) > new Date(max)
            ? getMessage(
                  message,
                  { max: format(new Date(max), formatString) },
                  value,
                  values
              )
            : undefined;
    }
);

/**
 * Number validator
 *
 * Returns an error if the value is not a number
 *
 * @param {string|function} message
 *
 * @example
 *
 * const ageValidators = [number('Must be a number')];
 * <TextInput name="age" validate={ageValidators} />
 */
export const number = memoize(
    (message = 'ra.validation.number') => (value, values) =>
        !isEmpty(value) && isNaN(Number(value))
            ? getMessage(message, undefined, value, values)
            : undefined
);

/**
 * Regular expression validator
 *
 * Returns an error if the value does not match the pattern given as parameter
 *
 * @param {RegExp} pattern
 * @param {string|function} message
 *
 * @example
 *
 * const zipValidators = [regex(/^\d{5}(?:[-\s]\d{4})?$/, 'Must be a zip code')];
 * <TextInput name="zip" validate={zipValidators} />
 */
export const regex = lodashMemoize(
    (pattern, message = 'ra.validation.regex') => (value, values) =>
        !isEmpty(value) && typeof value === 'string' && !pattern.test(value)
            ? getMessage(message, { pattern }, value, values)
            : undefined,
    (pattern, message) => {
        return pattern.toString() + message;
    }
);

/**
 * Email validator
 *
 * Returns an error if the value is not a valid email
 *
 * @param {string|function} message
 *
 * @example
 *
 * const emailValidators = [email('Must be an email')];
 * <TextInput name="email" validate={emailValidators} />
 */
export const email = memoize((message = 'ra.validation.email') =>
    regex(EMAIL_REGEX, message)
);

const oneOfTypeMessage: MessageFunc = ({ args }) => ({
    message: 'ra.validation.oneOf',
    args,
});

/**
 * Choices validator
 *
 * Returns an error if the value is not among the list passed as parameter
 *
 * @param {array} list
 * @param {string|function} message
 *
 * @example
 *
 * const genderValidators = [choices(['male', 'female'], 'Must be either Male or Female')];
 * <TextInput name="gender" validate={genderValidators} />
 */
export const choices = memoize(
    (list, message = oneOfTypeMessage) => (value, values) =>
        !isEmpty(value) && list.indexOf(value) === -1
            ? getMessage(message, { list }, value, values)
            : undefined
);
