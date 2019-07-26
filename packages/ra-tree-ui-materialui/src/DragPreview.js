import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { translate } from 'ra-core';

const useStyles = makeStyles(theme => ({
    item: {
        alignItems: 'center',
        backgroundColor: theme.palette.action.active,
        display: 'inline-flex',
        height: 72,
        minWidth: 72,
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(4),
    },
}));

const DragPreview = ({ children, className, node, style, translate }) => {
    const classes = useStyles();

    return (
        <div className={className || classes.item} style={style}>
            {children
                ? typeof children === 'function'
                    ? children({ node, translate })
                    : children
                : translate('ra.tree.drag_preview', {
                      id: node.id,
                      smart_count: node.children.length,
                  })}
        </div>
    );
};

DragPreview.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    className: PropTypes.string,
    node: PropTypes.object,
    style: PropTypes.object,
    translate: PropTypes.func.isRequired,
};

export default translate()(
    React.memo(DragPreview, () => {
        return false;
    })
);
