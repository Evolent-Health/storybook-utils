import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import { Grid, Header, Checkbox, Input, TextArea, Form } from "semantic-ui-react";

//import {Container, Row, Col} from 'wix-style-react/Grid';
//import {default as WixInput} from 'wix-style-react/Input';
//import ToggleSwitch from 'wix-style-react/ToggleSwitch';
//import Heading from 'wix-style-react/Heading';

import Markdown from '../../Markdown';
import ComponentSource from '../../ComponentSource';
import List from './list';
import Option from './option';

// import styles from './styles.scss';
let styles = {};

const Preview = ({children, onToggleRtl, isDarkBackground, onToggleBackground}) =>
    <div> 
      <div>
        <Header as="h2">Preview</Header>

        <div className={styles.previewControls}>
            <Checkbox
              toggle
              checked={isDarkBackground}
              label="Dark Background"
              onChange={(e, { checked }) => {
                onToggleBackground(checked);
              }}
            />
        </div>
        
      </div>

        <div 
          style={{ 
            padding: "60px 20px",
            border: "1px solid #dee6ed",
            boxShadow: "0 0 10px 2px #e5ebf1 inset",
            backgroundColor: (isDarkBackground ? "#5d5d5d" : "#f9f9f9" ),
            //backgroundImage: "linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%)",
            marginTop: "8px",
            borderRadius: "3px"
          }} 
        >
        {children}
      </div>
    </div>;
  

Preview.propTypes = {
  children: PropTypes.node,
  isRtl: PropTypes.bool,
  isDarkBackground: PropTypes.bool,
  onToggleRtl: PropTypes.func,
  onToggleBackground: PropTypes.func
};


const Toggle = ({value, onChange, ...props}) =>
  <Checkbox toggle
    checked={value}
    onChange={(e, { checked }) => {
      onChange(checked);
    }}
    {...props}
    />;

Toggle.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func
};

const handleValue = (value) => {
  let val = typeof value;

  switch(val) {
    case 'string':
        return value;
    case 'array':
        return value.toString();
    case 'object':
        return JSON.stringify(value, null, 2);
    default:
        return value;
  }
};

const CustomInput = ({value, onChange, defaultValue, ...props}) =>

(typeof value === 'array' || typeof value === 'object' ?
  <Form>
    <TextArea
      autoHeight
      style={{ maxHeight: "250px" }}
      value={handleValue(value)}
      onChange={({target: {value}}) => onChange(value)}
      placeholder={defaultValue}
      {...props}
      />
    </Form>
  :
  <Input
    value={handleValue(value)}
    onChange={({target: {value}}) => onChange(value)}
    placeholder={defaultValue}
    {...props}
    />
);

Input.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func
};

const Code = ({component}) =>
  <Grid.Column width={16}>
    <div className={styles.title}>
      <Markdown
        source={`## ${"Code"}`}
      />
    </div>

    <ComponentSource component={component}/>
  </Grid.Column>;

Code.propTypes = {
  component: PropTypes.node
};

export {
  Option,
  Preview,
  Toggle,
  CustomInput,
  List,
  Code
};
