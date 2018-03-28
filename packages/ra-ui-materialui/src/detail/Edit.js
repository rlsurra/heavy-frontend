import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent } from 'material-ui/Card';
import classnames from 'classnames';
import shallowEqual from 'recompose/shallowEqual';
import pick from 'lodash/pick';
import { EditController } from 'ra-core';

import Header from '../layout/Header';
import DefaultActions from './EditActions';
import RecordTitle from '../layout/RecordTitle';

const sanitizeRestProps = ({
    actions,
    children,
    className,
    crudGetOne,
    crudUpdate,
    data,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    id,
    isLoading,
    resetForm,
    resource,
    title,
    translate,
    version,
    match,
    location,
    history,
    options,
    locale,
    permissions,
    undoable,
    ...rest
}) => rest;

class EditView extends React.Component {
    state = {
        children: null,
    };

    componentWillMount() {
        this.setupChildren(this.props);
    }

    componentWillReceiveProps({ memoizeProps, ...nextProps }) {
        if (
            !memoizeProps ||
            !shallowEqual(
                pick(this.props, memoizeProps),
                pick(this.props, nextProps)
            )
        ) {
            this.setupChildren(nextProps);
        }
    }

    setupChildren = ({ children, ...props }) => {
        this.setState({
            children:
                typeof children === 'function' ? children(props) : children,
        });
    };

    render() {
        const {
            actions = <DefaultActions />,
            basePath,
            className,
            defaultTitle,
            hasList,
            hasShow,
            record,
            redirect,
            resource,
            save,
            title,
            version,
            ...rest
        } = this.props;
        const { children } = this.state;
        return (
            <div
                className={classnames('edit-page', className)}
                {...sanitizeRestProps(rest)}
            >
                <Card>
                    <Header
                        title={
                            <RecordTitle
                                title={title}
                                record={record}
                                defaultTitle={defaultTitle}
                            />
                        }
                        actions={actions}
                        actionProps={{
                            basePath,
                            data: record,
                            hasShow,
                            hasList,
                            resource,
                        }}
                    />
                    {record ? (
                        React.cloneElement(children, {
                            save,
                            resource,
                            basePath,
                            record,
                            version,
                            redirect:
                                typeof children.props.redirect === 'undefined'
                                    ? redirect
                                    : children.props.redirect,
                        })
                    ) : (
                        <CardContent>&nbsp;</CardContent>
                    )}
                </Card>
            </div>
        );
    }
}

EditView.propTypes = {
    actions: PropTypes.element,
    basePath: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    className: PropTypes.string,
    defaultTitle: PropTypes.any,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    memoizeProps: PropTypes.arrayOf(PropTypes.string),
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    resource: PropTypes.string,
    save: PropTypes.func,
    title: PropTypes.any,
    version: PropTypes.number,
};

/**
 * Page component for the Edit view
 *
 * The `<Edit>` component renders the page title and actions,
 * fetches the record from the data provider.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes pass the `record` as prop.
 *
 * The `<Edit>` component accepts the following props:
 *
 * - title
 * - actions
 *
 * Both expect an element for value.
 *
 * @example
 *     // in src/posts.js
 *     import React from 'react';
 *     import { Edit, SimpleForm, TextInput } from 'react-admin';
 *
 *     export const PostEdit = (props) => (
 *         <Edit {...props}>
 *             <SimpleForm>
 *                 <TextInput source="title" />
 *             </SimpleForm>
 *         </Edit>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'react-admin';
 *
 *     import { PostEdit } from './posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" edit={PostEdit} />
 *         </Admin>
 *     );
 *     export default App;
 */
const Edit = props => (
    <EditController {...props}>
        {controllerProps => <EditView {...props} {...controllerProps} />}
    </EditController>
);

Edit.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.node,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
};

export default Edit;
