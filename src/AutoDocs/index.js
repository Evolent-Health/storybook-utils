import React from "react";
import PropTypes from "prop-types";
import Markdown from "../Markdown";
import parser from "./parser";
import { Table } from "semantic-ui-react";

const shouldHideForE2E = global.self === global.top;

const prepareParsedProps = props => {
  console.log("props", props);
  const asList = Object.keys(props).map(key => ({
    ...props[key],
    name: key
  }));

  console.log("aslist", asList);

  const required = asList.filter(prop => prop.required);

  console.log("required", required);
  const notRequired = asList.filter(prop => !prop.required);

  console.log("notRequired", notRequired);

  // required props go first
  return required.concat(notRequired);
};

const wrap = name => children => (
  <span>
    {name}[{children}]
  </span>
);

const failSafe = type => () => (
  <span>
    Sorry, unable to parse this propType:
    <pre>{JSON.stringify(type, null, 2)}</pre>
  </span>
);

const renderPropType = (type = {}) => {
  const typeHandlers = {
    custom: () => wrap("custom")(),

    enum: value =>
      wrap("oneOf")(
        Array.isArray(value)
          ? value.map((v, i, allValues) => (
              /* eslint-disable */
              <span key={i}>
                <code>{v.value}</code>
                {allValues[i + 1] && ", "}
              </span>
              /* eslint-enable */
            ))
          : value
      ),

    union: value =>
      wrap("oneOfType")(
        value.map((v, i, allValues) => (
          <span key={i}>
            {renderPropType(v)}
            {allValues[i + 1] && ", "}
          </span>
        ))
      ),

    shape: value =>
      wrap("shape")(
        <ul>
          {Object.keys(value)
            .map(key => ({ ...value[key], key }))
            .map((v, i) => (
              <li key={i}>
                {v.key}
                :&nbsp;
                {renderPropType(v)}
                {v.required && (
                  <small>
                    <strong>&nbsp;required</strong>
                  </small>
                )}
              </li>
            ))}
        </ul>
      ),

    arrayOf: value => wrap("arrayOf")(renderPropType(value))
  };

  if (type.value) {
    return (typeHandlers[type.name] || failSafe(type))(type.value);
  }

  return <span>{type.name}</span>;
};

const AutoDocs = ({ source = "", parsedSource, showTitle }) => {
  const { description, displayName, props, composes = [], methods = [] } =
    parsedSource || parser(source);

  const propRow = (prop, index) => (
    <tr key={index}>
      <td>{prop.name || "-"}</td>
      <td>{renderPropType(prop.type)}</td>
      <td>
        {prop.defaultValue &&
          prop.defaultValue.value && (
            <Markdown source={`\`${prop.defaultValue.value}\``} />
          )}
      </td>
      <td>{prop.required && "Required"}</td>
      <td>{prop.description && <Markdown source={prop.description} />}</td>
    </tr>
  );

  const methodsToMarkdown = methods =>
    methods
      .filter(({ name }) => !name.startsWith("_"))
      .map(
        method =>
          `* __${method.name}(${method.params
            .map(({ name }) => name)
            .join(", ")})__: ${method.docblock || ""}`
      )
      .join("\n");

  return (
    !shouldHideForE2E && (
      <div>
        {showTitle &&
          displayName && (
            <div>
              <h1> {displayName && <code>{`<${displayName}/>`}</code>} </h1>
            </div>
          )}

        {!displayName && (
          <blockquote>
            This component has no <code>displayName</code>
          </blockquote>
        )}

        {description && <Markdown source={description} />}

        <h2>
          Available <code>props</code>
        </h2>

        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Default Value</Table.HeaderCell>
              <Table.HeaderCell>Required</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {prepareParsedProps(props).map(propRow)}

            {!parsedSource &&
              composes.length > 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5}>
                    Also includes props from:
                    <ul>
                      {composes.map((path, i) => (
                        <li key={i}> {path} </li>
                      ))}
                    </ul>
                  </Table.Cell>
                </Table.Row>
              )}
          </Table.Body>
        </Table>

        {methods.filter(({ name }) => !name.startsWith("_")).length > 0 && (
          <h2>
            Available <code>methods</code>
          </h2>
        )}
        {methods.length > 0 && <Markdown source={methodsToMarkdown(methods)} />}
      </div>
    )
  );
};

AutoDocs.propTypes = {
  source: PropTypes.string,
  parsedSource: PropTypes.object,
  showTitle: PropTypes.bool
};

AutoDocs.defaultProps = {
  showTitle: true
};

export default AutoDocs;
