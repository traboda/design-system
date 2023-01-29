import React, { ReactNode } from 'react';
import clsx from 'clsx';

import Icon, { IconInputType } from './Icon';

export type CardProps = {
  children: ReactNode,
  variant?: 'shaded' | 'outline',
  title?: string,
  description?: string,
  titleClassName?: string,
  icon?: IconInputType,
  id?: string,
  className?: string,
};

const Card = ({
  id, children, title, description, variant = 'shaded',
  className = '', titleClassName = '', icon,
}: CardProps) => {

  return (
      <div
          id={id}
          className={clsx([
            'dsr-p-4 dsr-rounded-lg dsr-h-full dark:dsr-border-white/20 dsr-border-black/20',
            variant === 'shaded' ? 'dark:dsr-bg-white/10 dsr-bg-gray-400/20' : '',
            variant === 'outline' ? 'dsr-border dsr-border-solid' : '',
            className,
          ])}
      >
          <div>
              {title && (
                  <h3 className={clsx(['dsr-text-3xl dsr-mb-2 dsr-font-semibold', titleClassName])}>
                      {icon ? <Icon icon={icon} /> : null}
                      {title}
                  </h3>
              )}
              {description && <p className="dsr-text-lg dsr-opacity-90 dsr-mb-2">{description}</p>}
              {children}
          </div>
      </div>
  );
};


export default Card;
