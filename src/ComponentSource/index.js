import React from "react";
import PropTypes from "prop-types";
import reactElementToJSXString from "react-element-to-jsx-string";
import CodeBlock from "../CodeBlock";
import removeHOC from "./remove-hoc";
import functionToString from "./function-to-string";

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

  let arr = jsx.split("IMPORTED_MODULE");

  if (arr.length > 1) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].includes("WEBPACK") && !arr[i].includes("{")) {
        arr[i] = "";
      } else if (arr[i].lastIndexOf("{") > arr[i].lastIndexOf("}")) {
        arr[i] = arr[i].substring(0, arr[i].lastIndexOf("{") + 1) + " (rendered jsx) ";
      } else {
        arr[i] = arr[i].substring(arr[i].indexOf("}") , arr[i].length);
      }
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
