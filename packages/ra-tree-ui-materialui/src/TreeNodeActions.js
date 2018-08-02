import React, { cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: theme.spacing.unit * 4,
    },
});

export class TreeNodeActionsView extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        basePath: PropTypes.string.isRequired,
        children: PropTypes.node,
        handleSubmit: PropTypes.func,
        record: PropTypes.object.isRequired,
        resource: PropTypes.string.isRequired,
        submitOnEnter: PropTypes.bool,
    };

    render() {
        const {
            basePath,
            children,
            classes,
            handleSubmit,
            record,
            resource,
            submitOnEnter,
        } = this.props;
        return (
            <span className={classes.root}>
                {Children.map(
                    children,
                    field =>
                        field
                            ? cloneElement(field, {
                                  basePath: field.props.basePath || basePath,
                                  handleSubmitWithRedirect: handleSubmit,
                                  handleSubmit,
                                  record,
                                  resource,
                                  submitOnEnter,
                              })
                            : null
                )}
            </span>
        );
    }
}

export default withStyles(styles)(TreeNodeActionsView);
