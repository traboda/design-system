import React, { ReactNode } from 'react';
import hyperid from 'hyperid';
import Icon from './Icon';
import { LinkWrapper } from '../utils/misc';
import clsx from 'clsx';
const generateId = hyperid();

export type BreadcrumbItemProps = {
  link?: string,
  title?: ReactNode,
  isActive?: boolean
};

export type BreadcrumbPropType = {
  items: BreadcrumbItemProps[],
  className?: string,
  itemClassName?: string
};

export const BreadcrumbItem = ({ item, className } : {
  item: BreadcrumbItemProps,
  className: string
}) => (
    <li className={clsx('breadcrumb-item dsr-flex dsr-items-center dsr-gap-2 dsr-text-color hover:dsr-text-primary', className)}>
        <span>
            {LinkWrapper(item?.link || '#', item?.title)}
        </span>
        <span className="dsr-text-color hover:dsr-text-primary">/</span>
    </li>
);

const Breadcrumb = ({ items, className = '', itemClassName = '' }: BreadcrumbPropType) => (
    <ul className={clsx(['breadcrumb dsr-text-lg dsr-flex dsr-gap-2 dsr-items-center dsr-opacity-75', className])}>
        <BreadcrumbItem
            item={{
              title: <Icon icon="home" size={18} />,
              link: '/',
            }}
            className={itemClassName}
        />
        {items.length > 0 && items.map((item) => (
            <BreadcrumbItem
                key={generateId()}
                item={item}
                className={itemClassName}
            />
        ))}
    </ul>
);


export default Breadcrumb;