import * as React from 'react';
import Dropdown from '../../baseComponents/Dropdown';
import {Placement} from '../../baseComponents/Popover/Popover';
import {TriggerElementProps} from '../../baseComponents/Dropdown/Dropdown';
import {Option} from '../../baseComponents/DropdownOption';
import {createHOC} from '../../createHOC';
import {HOVER, CLICK, CLICK_TYPE, HOVER_TYPE} from '../../baseComponents/Dropdown/constants';
import {bool, oneOf, object, arrayOf, string, func, oneOfType, number, node} from 'prop-types';
import Input from '../Input';

export interface InputWithOptionsClasses {
}

export interface InputWithOptionsProps {
  placement?: Placement;
  classes?: InputWithOptionsClasses;
  options: Array<Option>;
  openTrigger?: CLICK_TYPE | HOVER_TYPE;
  onSelect?: (option: Option) => void;
  onDeselect?: (option: Option) => void;
  initialSelectedIds?: Array<string | number>;
  closeOnSelect?: boolean;
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fixedHeader?: React.ReactNode;
  fixedFooter?: React.ReactNode;
  optionsMaxHeight?: number;
}

interface InputWithOptionsState {
  inputValue: string;
}

class InputWithOptions extends React.PureComponent<InputWithOptionsProps, InputWithOptionsState> {
  static defaultProps = {
    openTrigger: CLICK,
    placement: 'bottom-start',
    options: [],
    closeOnSelect: true,
    initialSelectedIds: [],
    onSelect: () => null,
    onDeselect: () => null
  };

  static propTypes = {
    /** Trigger type to open the content */
    openTrigger: oneOf([CLICK, HOVER]),
    /** The location to display the content */
    placement: string,
    /** The dropdown options array */
    options: arrayOf(object).isRequired,
    /** Handler for when an option is selected */
    onSelect: func,
    /** Handler for when an option is deselected */
    onDeselect: func,
    /** initial selected option ids */
    initialSelectedIds: oneOfType([arrayOf(number), arrayOf(string)]),
    /** Should close content on select */
    closeOnSelect: bool,
    /** Classes object */
    classes: object.isRequired,
    /** Event handler for when the input changes */
    onInputChange: func,
    /** An element that always appears at the top of the options */
    fixedHeader: node,
    /** An element that always appears at the bottom of the options */
    fixedFooter: node,
    /** Maximum height of the options */
    optionsMaxHeight: number
  };

  constructor(props) {
    super(props);

    this.onSelect = this.onSelect.bind(this);
    this.onDeselect = this.onDeselect.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.state = {
      inputValue: ''
    };
  }

  onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      inputValue: event.target.value
    });

    const {onInputChange} = this.props;
    onInputChange && onInputChange(event);
  }

  onDeselect(option) {
    const {inputValue} = this.state;
    this.setState({
      inputValue: inputValue.replace(option.value + ' ', '')
    });
  }

  onSelect(option) {
    const {inputValue} = this.state;
    this.setState({
      inputValue: inputValue + `${option.value} `
    });
  }

  render () {
    const {
      placement,
      options,
      openTrigger,
      onSelect,
      onDeselect,
      initialSelectedIds,
      closeOnSelect,
      fixedFooter,
      fixedHeader,
      optionsMaxHeight} = this.props;
    const {inputValue} = this.state;

    return (
      <Dropdown
        placement={placement}
        openTrigger={openTrigger}
        onSelect={onSelect}
        showArrow={false}
        optionsMaxHeight={optionsMaxHeight}
        fixedFooter={fixedFooter}
        fixedHeader={fixedHeader}
        onDeselect={onDeselect}
        initialSelectedIds={initialSelectedIds}
        options={options}
        closeOnSelect={closeOnSelect}>
        {
          ({onKeyDown}: TriggerElementProps) =>
            <Input
              value={inputValue}
              onChange={this.onInputChange}
              onKeyDown={onKeyDown}/>
        }
      </Dropdown>
    );
  }
}

export default createHOC(InputWithOptions);