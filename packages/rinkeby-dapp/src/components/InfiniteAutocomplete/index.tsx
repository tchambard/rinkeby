import React from 'react';
import { Autocomplete, AutocompleteProps } from '@mui/material';
import { AutoSizer, InfiniteLoader, List } from 'react-virtualized';
import SuspenseLoader from '../SuspenseLoader/index';

const ListboxComponent: any = React.forwardRef<any, IListboxComponentProps>((props, ref) => {
    const { children, loadNextPage, hasNextPage, totalItems, loading, ...other } = props;
    const itemCount = Array.isArray(children) ? children.length : 0;
    const itemSize = 36;

    return (
        <div {...other} ref={ref}>
            <InfiniteLoader
                itemCount={itemCount}
                isRowLoaded={({ index }) => !hasNextPage || index < itemCount}
                loadMoreRows={() => loadNextPage()}
                rowCount={totalItems}
                threshold={20}
                minimumBatchSize={40}
            >
                {({ onRowsRendered, registerChild }) => (
                    <AutoSizer disableHeight>
                        {({ width }) => (
                            <List
                                ref={registerChild}
                                height={250}
                                width={width}
                                rowHeight={itemSize}
                                overscanCount={5}
                                rowCount={itemCount}
                                onRowsRendered={onRowsRendered}
                                rowRenderer={_props => {
                                    if (loading) {
                                        return <SuspenseLoader/>;
                                    }
                                    return React.cloneElement(children[_props.index], {
                                        style: _props.style,
                                    });
                                }}
                            />
                        )}
                    </AutoSizer>
                )}
            </InfiniteLoader>
        </div>
    );
});

interface IListboxComponentProps {
    loadNextPage: () => Promise<void>;
    totalItems: number;
    hasNextPage: boolean;
    loading: boolean;
}

type IInfiniteAutocompleteProps<T> = IListboxComponentProps & AutocompleteProps<T, undefined, undefined, undefined>;

function InfiniteAutocomplete<T>(props: IInfiniteAutocompleteProps<T>) {
    const { loadNextPage, totalItems, hasNextPage, ...other } = props;
    const listboxProps: any = {
        loadNextPage,
        totalItems,
        hasNextPage,
    };
    return (
        <Autocomplete
            style={{ width: '100%' }}
            disableListWrap
            ListboxComponent={ListboxComponent}
            ListboxProps={listboxProps}
            {...other}
        />
    );
}

export default InfiniteAutocomplete;
