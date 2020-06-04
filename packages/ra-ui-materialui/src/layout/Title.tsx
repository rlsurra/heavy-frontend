import React, { cloneElement, FC, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useTranslate, warning, TitleComponent } from 'ra-core';

const Title: FC<TitleProps> = ({
    className,
    defaultTitle,
    record,
    title,
    ...rest
}) => {
    const translate = useTranslate();
    const container =
        typeof document !== 'undefined'
            ? document.getElementById('react-admin-title')
            : null;
    if (!container) return null;
    warning(!defaultTitle && !title, 'Missing title prop in <Title> element');

    const titleElement = !title ? (
        <span className={className} {...rest}>
            {defaultTitle}
        </span>
    ) : typeof title === 'string' ? (
        <span className={className} {...rest}>
            {translate(title, { _: title })}
        </span>
    ) : (
        cloneElement(title, { className, record, ...rest })
    );
    return createPortal(titleElement, container);
};

export interface TitleProps {
    defaultTitle: TitleComponent;
    className?: string;
    record?: any;
    title?: TitleComponent;
}

export const TitlePropType = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
]);

Title.propTypes = {
    defaultTitle: PropTypes.string,
    className: PropTypes.string,
    record: PropTypes.object,
    title: TitlePropType,
};

export default Title;
