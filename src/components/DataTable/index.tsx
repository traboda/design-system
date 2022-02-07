import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { nanoid } from 'nanoid';
import { throttle } from 'lodash';

import Button from '../Button';

import ItemListerTitleBar from './title';
import ItemListerItem, { ItemListerProperty } from './item';
import { defaultLinkWrapper } from "../../utils/misc";
import styled from "@emotion/styled";


const TitleBarContainer = styled('div')`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  
  .custom-top-bar {
    background: ${({ theme }) => theme.background};
  }
`;

const defaultLabels = {
    'endOfList': 'You have reached the end of this list.'
};

type ItemListerProps = {
    properties: ItemListerProperty[],
    items: {
        id: string
    }[],
    labels?: {
        description?: string,
        endOfList?: string
    },
    maxHeight?: string,
    isLoading?: boolean,
    canLoadMore?: boolean,
    onLoadMore?: () => void,
    emptyListRenderer?: () => ReactNode,
    currentSortAttribute?: string,
    sortOrder?: ('asc' | 'desc'),
    onSort?: (attribute: string, order: ('asc' | 'desc' | null)) => void,
    customTopBarRenderer?: () => React.ReactElement,
    loadable?: boolean,
    stickyRow?: object,
    linkWrapper?: (link: string, component: React.ReactNode) => React.ReactNode,
}

const ItemLister = ({
    properties = [],
    items = [], labels: labelProps,
    emptyListRenderer = () => <div />,
    isLoading = false, canLoadMore = false,
    onLoadMore = () => {}, maxHeight = null,
    currentSortAttribute, sortOrder, onSort = () => null,
    customTopBarRenderer = () => <div />, loadable = true,
    stickyRow = null, linkWrapper = defaultLinkWrapper
}: ItemListerProps) => {

    const labels = { ...defaultLabels, ...labelProps };

    const TitleBarRef = useRef(null);
    const TitleTopRef = useRef(null);
    const [scrollDir, setScrollDir] = useState('up');

    // @ts-ignore
    useEffect(() => {
        // getting scroll parent
        const getScrollParent = (node) => {
            if (node == null) return null;
            if (node.scrollHeight > node.clientHeight)
                return node;
            return getScrollParent(node.parentNode);
        };
        const element = getScrollParent(TitleBarRef.current);

        // detect the scroll direction
        let lastScrollTop = 0;
        const handleScroll = throttle(() => {
            const st = element.scrollTop;
            setScrollDir(st > lastScrollTop ? 'down' : 'up');
            lastScrollTop = Math.max(st, 0);
        }, 200);

        // setting event listeners
        if (element) {
            element.addEventListener('scroll', handleScroll, false);
            return () => element.removeEventListener('scroll', handleScroll);
        }

    }, []);

    return <div>
        {labels?.description &&
            <div className="mb-2 py-3 px-1">
                {labels?.description}
            </div>}
        {(!isLoading && items?.length === 0) ? (
            <div>
                {customTopBarRenderer()}
                {emptyListRenderer()}
            </div>
        ) : (
            <div style={{ overflowX: maxHeight ? 'auto' : null, maxHeight: maxHeight }}>
                <TitleBarContainer ref={TitleBarRef}>
                    <div
                        className="custom-top-bar transition-opacity"
                        ref={TitleTopRef}
                        style={{
                            pointerEvents: scrollDir === 'up' ? 'auto' : 'none',
                            opacity: scrollDir === 'up' ? 1 : 0,
                            width: TitleBarRef.current?.scrollWidth
                        }}
                    >
                        {customTopBarRenderer()}
                    </div>

                    <ItemListerTitleBar
                        properties={properties}
                        onSort={onSort}
                        currentSortAttribute={currentSortAttribute}
                        sortOrder={sortOrder}
                        stickyRow={stickyRow}
                        scrollDir={scrollDir}
                        titleTopRef={TitleTopRef}
                    />
                </TitleBarContainer>

                <div className="flex flex-col">
                    {items?.length > 0 && items.map((i, index) =>
                        <ItemListerItem
                            key={i.id ? i.id : nanoid()}
                            isShaded={index % 2 === 0}
                            properties={properties}
                            item={i}
                            itemIndex={index}
                            linkWrapper={linkWrapper}
                        />
                    )}
                    {isLoading && Array(10).fill(0).map((_n, index) =>
                        <ItemListerItem
                            key={nanoid()}
                            isShaded={index % 2 === 0}
                            properties={properties}
                            isLoading
                            linkWrapper={linkWrapper}
                        />
                    )}
                </div>
                {loadable && (canLoadMore ?
                    <Waypoint onEnter={() => !isLoading ? onLoadMore() : null}>
                        <div>
                            {!isLoading &&
                                <div className="mb-6">
                                    <div className="flex justify-center items-center text-center pt-4">
                                        <Button inverseColors m={1} onClick={onLoadMore}>
                                            Load more
                                        </Button>
                                    </div>
                                </div>}
                        </div>
                    </Waypoint> :
                    <div className="my-4 text-center" style={{ opacity: 0.8 }}>
                        {labels.endOfList}
                    </div>
                )}
            </div>
        )}
    </div>;

};

export default ItemLister;