import React from "react";
import PropTypes from "prop-types";
import { Icon, Dropdown, Form, Radio, Button } from "semantic-ui-react";
import NO_VALUE_TYPE from "../../AutoExample/no-value-type";

// const isUndefined = a => typeof a === "undefined";

export default class List extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    values: PropTypes.arrayOf(PropTypes.any),
    onChange: PropTypes.func,
    required: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      currentValue: {},
      currentFilter: props.defaultValue || "",
      isFiltering: false,
      options: this.createOptions(props.values || [])
    };
  }

  createOptions = values =>
    values.map((option, id) => {
      option = option || {};
      return {
        id: option.id || id,
        // value: option.label || (option.type && option.type.name) || "" + option,
        value: option.value,
        // realValue: isUndefined(option.value) ? option : option.value
        realValue: option.computed
      };
    });

  getFilteredOptions = () =>
    this.state.isFiltering
      ? this.state.options.filter(
          ({ value }) =>
            this.state.currentFilter.length
              ? value.toLowerCase().includes(this.state.currentFilter)
              : true
        )
      : this.state.options;

  clearValue = () =>
    this.setState({ currentValue: {}, currentFilter: "" }, () =>
      this.props.onChange(NO_VALUE_TYPE)
    );

  clearIcon = (
    <span
      onClick={this.clearValue}
      style={{ color: "#3899ec", cursor: "pointer" }}
      children={<Icon name="close" size="large" />}
    />
  );

  clearButton = (
    <div style={{ padding: "1em 0" }}>
      <Button icon onClick={this.clearValue}>
        <Icon name="window minimize" />
      </Button>
    </div>
  );

  getSelectedId = () => {
    const selectedOption =
      this.state.options.find(
        option => option.id === this.state.currentValue.id
      ) || {};
    return selectedOption.id || 0;
  };

  onOptionChange = ({ id }) => {
    const currentValue =
      this.state.options.find(option => option.id === id) || {};

    this.setState(
      {
        currentValue,
        currentFilter: currentValue.value,
        isFiltering: false
      },
      () => this.props.onChange(currentValue.realValue)
    );
  };

  onFilterChange = ({ target: { value: currentFilter } }) =>
    this.setState({ currentFilter, isFiltering: true });

  dropdown() {
    return (
      <Dropdown
        value={this.state.currentFilter}
        options={this.getFilteredOptions()}
        selectedId={this.getSelectedId()}
        onSelect={this.onOptionChange}
        onChange={this.onFilterChange}
        placeholder={this.props.defaultValue || ""}
        {...(this.state.currentFilter && !this.props.required
          ? { suffix: this.clearIcon }
          : {})}
      />
    );
  }

  radios() {
    return (
      <div>
        <Form>
          {this.state.options.map(({ id, value, realValue }) => (
            <Form.Field key={id}>
              <Radio
                label={value}
                name="radioGroup"
                value={id}
                defaultChecked={realValue}
              />
            </Form.Field>
          ))}
        </Form>
        {!this.props.required &&
          this.state.currentValue.value &&
          this.clearButton}
      </div>
    );
  }

  render() {
    // return this.props.values.length > 3 ? this.dropdown() : this.radios();
    return this.radios();
  }
}
