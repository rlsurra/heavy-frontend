import { UseQueryOptions } from 'react-query';
import { useResourceContext } from '../core';
import { useGetList } from '../dataProvider';
import { useStore } from '../store';
import { FilterPayload, RaRecord, SortPayload } from '../types';
import { ListParams, SORT_ASC } from './list';
import { useRecordContext } from './record';
import { useCreatePath } from '../routing';

/**
 * A hook used to fetche previous and next record IDs for a given record and resource.
 *
 * It fetches the list of records from the REST API according to the filters
 * and the sort order configured in the lists by the users and
 * also merges the filters and the sorting order passed into props.
 *
 * `usePrevNextController` should be used anywhere a record context is provided
 * (eg: often inside a `<Show>` or `<Edit>` component).
 *
 * @example <captoin>Simple usage</caption>
 *
 * import { UsePrevNextControllerProps } from 'ra-core';
 * const {
 *         hasPrev,
 *         hasNext,
 *         navigateToNext,
 *         navigateToPrev,
 *         index,
 *         total,
 *         error,
 *         isLoading,
 *     } = usePrevNextController(props);
 *
 * @example <caption>Custom PrevNextButton</caption>
 *
 * import { UsePrevNextControllerProps, useTranslate } from 'ra-core';
 * import { NavigateBefore, NavigateNext } from '@mui/icons-material';
 * import ErrorIcon from '@mui/icons-material/Error';
 * import { Link } from 'react-router-dom';
 * import { CircularProgress, IconButton } from '@mui/material';
 *
 * const MyPrevNextButtons = props => {
 *     const {
 *         hasPrev,
 *         hasNext,
 *         navigateToNext,
 *         navigateToPrev,
 *         index,
 *         total,
 *         error,
 *         isLoading,
 *     } = usePrevNextController(props);
 *
 *     const translate = useTranslate();
 *
 *     if (isLoading) {
 *         return <CircularProgress size={14} />;
 *     }
 *
 *     if (error) {
 *         return (
 *             <ErrorIcon
 *                 color="error"
 *                 fontSize="small"
 *                 titleAccess="error"
 *                 aria-errormessage={error.message}
 *             />
 *         );
 *     }
 *
 *     return (
 *         <ul>
 *             <li>
 *                 <IconButton
 *                     component={hasPrev ? Link : undefined}
 *                     to={navigateToPrev}
 *                     aria-label={translate('ra.navigation.previous')}
 *                     disabled={!hasPrev}
 *                 >
 *                     <NavigateBefore />
 *                 </IconButton>
 *             </li>
 *             {typeof index === 'number' && (
 *                 <li>
 *                     {index + 1} / {total}
 *                 </li>
 *             )}
 *             <li>
 *                 <IconButton
 *                     component={hasNext ? Link : undefined}
 *                     to={navigateToNext}
 *                     aria-label={translate('ra.navigation.next')}
 *                     disabled={!hasNext}
 *                 >
 *                     <NavigateNext />
 *                 </IconButton>
 *             </li>
 *         </ul>
 *     );
 * };
 */

export const usePrevNextController = <RecordType extends RaRecord = any>(
    props: UsePrevNextControllerProps<RecordType>
): UsePrevNextControllerResult => {
    const {
        linkType = 'edit',
        storeKey,
        limit = 1000,
        sort = { field: 'id', order: SORT_ASC },
        filter = {},
        queryOptions = {
            staleTime: 5 * 60 * 1000,
        },
    } = props;

    const record = useRecordContext<RecordType>(props);
    const resource = useResourceContext(props);

    if (!resource) {
        throw new Error(
            `<useNextPrevController> was called outside of a ResourceContext and without a resource prop. You must set the resource prop.`
        );
    }

    if (!record) {
        throw new Error(
            `<useNextPrevController> was called outside of a RecordContext and without a record prop. You must set the record prop.`
        );
    }

    const [storedParams] = useStore<StoredParams>(
        storeKey || `${resource}.listParams`,
        {
            filter,
            order: sort.order,
            sort: sort.field,
        }
    );

    const { data, error, isLoading } = useGetList<RecordType>(
        resource,
        {
            sort: {
                ...{ field: storedParams.sort, order: storedParams.order },
                ...sort,
            },
            filter: { ...storedParams.filter, ...filter },
            pagination: { page: 1, perPage: limit },
        },
        queryOptions
    );

    const ids = data ? data.map(record => record.id) : [];

    const index = ids.indexOf(record.id);

    const previousId =
        typeof ids[index - 1] !== 'undefined' ? ids[index - 1] : null; // could be 0

    const nextId =
        index !== -1 && index < ids.length - 1 ? ids[index + 1] : null;

    const createPath = useCreatePath();

    return {
        hasPrev: previousId !== null,
        hasNext: nextId !== null,
        navigateToPrev:
            previousId !== null
                ? createPath({
                      type: linkType,
                      resource,
                      id: previousId,
                  })
                : undefined,
        navigateToNext:
            nextId !== null
                ? createPath({
                      type: linkType,
                      resource,
                      id: nextId,
                  })
                : undefined,
        index: index === -1 ? undefined : index,
        total: data?.length,
        error,
        isLoading,
    };
};

export interface UsePrevNextControllerProps<RecordType extends RaRecord = any> {
    linkType?: 'edit' | 'show';
    storeKey?: string | false;
    limit?: number;
    filter?: FilterPayload;
    sort?: SortPayload;
    resource?: string;
    queryOptions?: UseQueryOptions<{
        data: RecordType[];
        total?: number;
        pageInfo?: {
            hasNextPage?: boolean;
            hasPreviousPage?: boolean;
        };
    }> & { meta?: any };
}

export interface UsePrevNextControllerResult {
    hasPrev: boolean;
    hasNext: boolean;
    navigateToPrev: string | undefined;
    navigateToNext: string | undefined;
    index: number | undefined;
    total: number | undefined;
    error?: any;
    isLoading: boolean;
}

type StoredParams = Pick<ListParams, 'filter' | 'order' | 'sort'>;