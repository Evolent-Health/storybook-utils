import React from "react";
import PropTypes from "prop-types";
import reactElementToJSXString from "react-element-to-jsx-string";
import CodeBlock from "../CodeBlock";
import removeHOC from "./remove-hoc";
import functionToString from "./function-to-string";

import prettyFormat from "pretty-format";
import renderer from 'react-test-renderer';
const { ReactTestComponent } = prettyFormat.plugins;

const componentToJSX = component =>
  reactElementToJSXString(component, {
    displayName: element =>
      element.type.displayName
        ? removeHOC(element.type.displayName)
        : element.type.name || element.type,
    showDefaultProps: false,
    showFunctions: false,
    functionValue: functionToString
  });

const formatJSX = component => {
  const jsx = componentToJSX(component);

  let arr = jsx.split(/[{}]+/);

  for (let i = 1; i < arr.length; i++) {
      if (arr[i].includes("WEBPACK")) {
          arr[i] = "{ (function) }";
      } else {	
        arr[i] = "{" + arr[i] + "}";	
    }
  }

  return arr.join("");
}

// Given react component, render a source example
const ComponentSource = ({ component }) => (
  <CodeBlock source={formatJSX(component)} />
);

ComponentSource.propTypes = {
  component: PropTypes.node
};

export default ComponentSource;
