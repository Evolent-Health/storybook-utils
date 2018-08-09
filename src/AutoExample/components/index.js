import React from "react";
import PropTypes from "prop-types";
import Markdown from "../../Markdown";
import ComponentSource from "../../ComponentSource";
import List from "./list";
import Option from "./option";
import {
  Grid,
  Header,
  Checkbox,
  Input,
  TextArea,
  Form
} from "semantic-ui-react";

// import styles from "./styles.scss";
let styles = {};

const Preview = ({ children }) => (
  <div>
    <div>
      <Header as="h2">Preview</Header>
    </div>

    <div
      style={{
        padding: "60px 20px",
        border: "1px solid #dee6ed",
        boxShadow: "0 0 10px 2px #e5ebf1 inset",
        backgroundColor: "#f6f8fa",
        marginTop: "8px",
        borderRadius: "3px"
      }}
    >
      {children}
    </div>
  </div>
);

Preview.propTypes = {
  children: PropTypes.node
};

const Toggle = ({ value, onChange, ...props }) => (
  <Checkbox
    toggle
    checked={value}
    onChange={(e, { checked }) => {
      onChange(checked);
    }}
    {...props}
  />
);

Toggle.propTypes = {
  value: PropTypes.bool,
  onChange: PropTypes.func
};

const handleValue = value => {
  if (Array.isArray(value)) {
    return value.toString();
  }

  let val = typeof value;

  switch (val) {
    case "string":
      return value;
    case "object":
      return JSON.stringify(value, null, 2);
    default:
      return value;
  }
};

const CustomInput = ({ value, onChange, defaultValue, ...props }) =>
  Array.isArray(value) || typeof value === "object" ? (
    <Form>
      <TextArea
        autoHeight
        style={{ maxHeight: "180px" }}
        value={handleValue(value)}
        onChange={null}
        placeholder={defaultValue}
        {...props}
      />
    </Form>
  ) : (
    <Input
      fluid
      value={handleValue(value)}
      onChange={({ target: { value } }) => onChange(value)}
      placeholder={defaultValue}
      {...props}
    />
  );

CustomInput.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func
};

const Code = ({ component }) => (
  <Grid.Column width={16}>
    <div className={styles.title}>
      <Markdown source={`## ${"Code"}`} />
    </div>

    <ComponentSource component={component} />
  </Grid.Column>
);

Code.propTypes = {
  component: PropTypes.node
};

export { Option, Preview, Toggle, CustomInput, List, Code };
