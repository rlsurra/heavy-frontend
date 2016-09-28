import React, { Component, PropTypes } from 'react';
import DatePicker from 'material-ui/DatePicker';

export const datify = input => {
    if (!input) {
        return null;
    }

    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date)) {
        throw new Error(`Invalid date: ${input}`);
    }

    return date;
};

class DateInput extends Component {
    onChange = (_, date) => this.props.input.onChange(date);

    render() {
        const {
            input,
            label,
            locale,
            meta: {
                touched,
                error,
            },
            options,
        } = this.props;

        return (<DatePicker
            {...input}
            {...options}
            errorText={touched && error}
            floatingLabelText={label}
            locale={locale}
            DateTimeFormat={Intl.DateTimeFormat}
            container="inline"
            autoOk
            value={datify(input.value)}
            onChange={this.onChange}
        />);
    }
}

DateInput.propTypes = {
    includesLabel: PropTypes.bool,
    input: PropTypes.object,
    label: PropTypes.string,
    locale: PropTypes.string.isRequired,
    meta: PropTypes.object,
    options: PropTypes.object,
};

DateInput.defaultProps = {
    includesLabel: true,
    locale: 'en-US',
    options: {},
};

export default DateInput;
