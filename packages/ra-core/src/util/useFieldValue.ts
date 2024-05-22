import get from 'lodash/get';
import { useRecordContext } from '../controller';
import { useSourceContext } from '../core';

/**
 * A hook that gets the value of a field of the current record.
 * @param params The hook parameters
 * @param params.source The field source
 * @param params.record The record to use. Uses the record from the RecordContext if not provided
 * @param params.defaultValue The value to return when the field value is empty
 * @returns The field value
 *
 * @example
 * const MyField = (props: { source: string }) => {
 *   const value = useFieldValue(props);
 *   return <span>{value}</span>;
 * }
 */
export const useFieldValue = <
  RecordType extends Record<string, any> = Record<string, any>
>(
  params: UseFieldValueOptions<RecordType>
) => {
  const { defaultValue, source } = params;
  const sourceContext = useSourceContext();
  const record = useRecordContext<RecordType>(params);

  return get(
    record,
    sourceContext?.getSource(source) ?? source,
    defaultValue
  );
};

export interface UseFieldValueOptions<
  RecordType extends Record<string, any> = Record<string, any>
> {
  // FIXME: Find a way to throw a type error when defaultValue is not of RecordType[Source] type
  defaultValue?: any;

  source?: keyof RecordType extends never ? AnyString : keyof RecordType;
  record?: RecordType;
}

type AnyString = string & {};
