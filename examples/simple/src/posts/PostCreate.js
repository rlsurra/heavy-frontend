import React, { Component } from 'react';
import { connect } from 'react-redux';

import RichTextInput from 'ra-input-rich-text';
import {
    crudCreate,
    BooleanInput,
    Create,
    DateInput,
    FormDataConsumer,
    LongTextInput,
    NumberInput,
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    ArrayInput,
    SimpleFormIterator,
    ReferenceInput,
    AutocompleteInput,
    SelectInput,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const saveAsCommentable = (values, basePath, redirectTo) =>
    crudCreate('posts', { ...values, commentable: true }, basePath, redirectTo);

const SaveAsCommentableButton = connect(
    undefined,
    { saveAsCommentable }
)(
    class SaveAsCommentableButton extends Component {
        handleClick = () => {
            const {
                basePath,
                handleSubmit,
                redirect,
                saveAsCommentable,
            } = this.props;

            return handleSubmit(values => {
                saveAsCommentable(values, basePath, redirect);
            });
        };

        render() {
            const {
                handleSubmitWithRedirect,
                saveAsCommentable,
                ...props
            } = this.props;

            return (
                <SaveButton
                    handleSubmitWithRedirect={this.handleClick}
                    {...props}
                />
            );
        }
    }
);

const PostCreateToolbar = props => (
    <Toolbar {...props}>
        <SaveButton
            label="post.action.save_and_show"
            redirect="show"
            submitOnEnter={true}
        />
        <SaveButton
            label="post.action.save_and_add"
            redirect={false}
            submitOnEnter={false}
            variant="flat"
        />
        <SaveAsCommentableButton
            label="post.action.save_commentable"
            redirect="show"
            submitOnEnter={false}
            variant="flat"
        />
    </Toolbar>
);

const getDefaultDate = () => new Date();

const PostCreate = ({ permissions, ...props }) => (
    <Create {...props}>
        <SimpleForm
            toolbar={<PostCreateToolbar />}
            defaultValue={{ average_note: 0 }}
            validate={values => {
                const errors = {};
                ['title', 'teaser'].forEach(field => {
                    if (!values[field]) {
                        errors[field] = ['Required field'];
                    }
                });

                if (values.average_note < 0 || values.average_note > 5) {
                    errors.average_note = ['Should be between 0 and 5'];
                }

                return errors;
            }}
        >
            <TextInput source="title" />
            <LongTextInput source="teaser" />
            <RichTextInput source="body" />
            <FormDataConsumer>
                {({ formData, ...rest }) =>
                    formData.title && (
                        <NumberInput source="average_note" {...rest} />
                    )
                }
            </FormDataConsumer>
            <DateInput source="published_at" defaultValue={getDefaultDate} />
            <BooleanInput source="commentable" defaultValue />
            {permissions === 'admin' && (
                <ArrayInput source="authors">
                    <SimpleFormIterator>
                        <ReferenceInput
                            label="User"
                            source="user_id"
                            reference="users"
                        >
                            <AutocompleteInput />
                        </ReferenceInput>
                        <SelectInput
                            source="role"
                            choices={[
                                { id: 'headwriter', name: 'Head Writer' },
                                { id: 'proofreader', name: 'Proof reader' },
                                { id: 'cowriter', name: 'Co-Writer' },
                            ]}
                        />
                    </SimpleFormIterator>
                </ArrayInput>
            )}
        </SimpleForm>
    </Create>
);

export default PostCreate;
