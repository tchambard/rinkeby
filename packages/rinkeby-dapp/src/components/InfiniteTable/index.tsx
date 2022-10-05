import * as _ from 'lodash';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import scrollbarSize from 'dom-helpers/scrollbarSize';
import { Column, ColumnProps, Index, InfiniteLoader, SortIndicator, Table, TableHeaderProps } from 'react-virtualized';
import { createMultiSort, SortDirectionMap, TableProps } from 'react-virtualized/dist/es/Table';
import clsx from 'clsx';

import { styled } from '@mui/material/styles';

import 'react-virtualized/styles.css';
import SuspenseLoader from '../SuspenseLoader/index';

export type SortDirectionParam = 'asc' | 'desc';

export interface ISortByParams {
    field: string;
    direction?: SortDirectionParam;
}

const PREFIX = 'InfiniteTable';

const classes = {
    flexContainer: `${PREFIX}-flexContainer`,
    table: `${PREFIX}-table`,
    tableRow: `${PREFIX}-tableRow`,
    tableRowHover: `${PREFIX}-tableRowHover`,
    tableCell: `${PREFIX}-tableCell`,
    noClick: `${PREFIX}-noClick`,
};

const StyledInfiniteLoader = styled(InfiniteLoader)(({ theme }) => ({
    [`& .${classes.flexContainer}`]: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    [`& .${classes.table}`]: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            ...(theme.direction === 'rtl' && {
                paddingLeft: '0 !important',
            }),
            ...(theme.direction !== 'rtl' && {
                paddingRight: undefined,
            }),
        },
    },
    [`& .${classes.tableRow}`]: {
        cursor: 'pointer',
    },
    [`& .${classes.tableRowHover}`]: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
    [`& .${classes.tableCell}`]: {
        flex: 1,
    },
    [`& .${classes.noClick}`]: {
        cursor: 'initial',
    },
}));

interface IScrollSyncRightTable extends Partial<TableProps> {
    columns: ColumnProps[];
    rows: any[];
    fetchRows?: () => void;
    isLoading: boolean;
}

interface IProps extends Partial<TableProps> {
    columns: ColumnProps[];
    rows: any[];
    totalRows: number;
    fetchRows: (sortByParams: ISortByParams[]) => void;
    loadMoreRows?: () => void;
    sortByParams?: ISortByParams[];
    isLoading: boolean;
    scrollSync?: IScrollSyncRightTable;
    threshold?: number;
    minimumBatchSize?: number;
}

export default (props: IProps) => {
    const { columns, rows, totalRows, fetchRows, loadMoreRows, sortByParams, isLoading, scrollSync, threshold, minimumBatchSize } = props;

    const dispatch = useDispatch();

    const [height] = React.useState(props.height || 700);
    const [overscanRowCount] = React.useState(5);
    const [headerHeight] = React.useState(48);
    const [rowHeight] = React.useState(48);

    const leftColumnsWidth = columns.reduce((width, column) => {
        return width + column.width;
    }, 0);

    const noRowsRenderer = (_isLoading: boolean) => {
        return _isLoading ?
            <SuspenseLoader/> :
            <div className={'noRows'}>No data</div>;
    };

    const headerRenderer = (_props: TableHeaderProps) => {
        if (!sortByParams) {
            return <span>{_props.label}</span>;
        }
        const showSortIndicator = getSortByFields().includes(_props.dataKey);
        return (
            <>
                <span>{_props.label}</span>
                {showSortIndicator && (
                    <SortIndicator sortDirection={getSortDirection()[_props.dataKey]}/>
                )}
            </>
        );
    };

    const rowClassName = (index: Index): any => {
        return clsx(classes.tableRow, classes.flexContainer, classes.tableRowHover);
    };

    const getSortByFields = (): string[] => {
        return _.map(sortByParams, p => p.field);
    };

    const getSortDirection = (): SortDirectionMap => {
        return _.reduce(sortByParams, (acc, curr) => {
            acc[curr.field] = curr.direction?.toUpperCase() || 'ASC';
            return acc;
        }, {} as any);
    };

    const sortWithDispatch = (params: { sortBy: string[]; sortDirection: SortDirectionMap }) => {
        // TODO: manage multiple field sort. add, update or remove field depending on direction changes
        const newSortParams: ISortByParams[] = _.map(params.sortDirection, (direction, field) => {
            return { field, direction: direction.toLowerCase() as SortDirectionParam };
        });
        dispatch(fetchRows(newSortParams));
    };

    const sortState = createMultiSort(sortWithDispatch as any, {
        defaultSortBy: getSortByFields(),
        defaultSortDirection: getSortDirection(),
    });

    return (

        <StyledInfiniteLoader
            isRowLoaded={({ index }) => !!rows[index]}
            loadMoreRows={() => loadMoreRows && rows.length < totalRows ? Promise.resolve(dispatch(loadMoreRows())) : Promise.resolve()}
            rowCount={totalRows}
            threshold={threshold || 20}
            minimumBatchSize={minimumBatchSize || 40}
        >
            {({ onRowsRendered, registerChild }) => (
                <div className={'GridRow'}>
                    <div
                        className={'LeftSideGridContainer'}
                        style={{
                            position: 'relative',
                            overflow: 'auto',
                            left: 0,
                            top: 0,
                        }}>

                        <Table
                            headerHeight={headerHeight}
                            overscanRowCount={overscanRowCount}
                            ref={registerChild}
                            onRowsRendered={onRowsRendered}
                            className={'LeftSideGrid'}
                            rowHeight={rowHeight}
                            noRowsRenderer={() => noRowsRenderer(isLoading)}
                            rowClassName={rowClassName}
                            sort={sortState.sort as any}
                            sortBy={undefined}
                            sortDirection={undefined}
                            rowCount={rows.length}
                            rowGetter={({ index }) => rows[index]}
                            width={leftColumnsWidth}
                            {...props}
                            height={height - scrollbarSize()}
                        >
                            {
                                columns.map((column) => {
                                    return <Column key={`column-left-${column.dataKey}`}
                                                   {...column}
                                                   maxWidth={column.width}
                                                   headerRenderer={headerRenderer}/>;
                                })
                            }
                        </Table>
                    </div>
                </div>
            )}
        </StyledInfiniteLoader>
    );
};
