import React from "react";
import PropTypes from "prop-types";
import { Grid, Tab, Divider, Header } from "semantic-ui-react";
import Markdown from "../Markdown";
import AutoDocs from "../AutoDocs";
import CodeBlock from "../CodeBlock";
import AutoExample from "../AutoExample";
import omit from "../AutoExample/utils/omit";
import "semantic-ui-less/semantic.less";

const importString = ({ metadata, config, exampleImport }) =>
  [
    {
      when: () => exampleImport,
      make: () => exampleImport
    },
    {
      when: () => config.importFormat,
      make: () =>
        config.importFormat
          .replace(/%componentName/g, "")
          .replace(
            new RegExp("%(" + Object.keys(config).join("|") + ")", "g"),
            (match, configKey) => config[configKey] || ""
          )
    },
    {
      when: () => true,
      make: () =>
        `import { ${metadata.displayName} } from '${config.moduleName}';`
    }
  ]
    .find(({ when }) => when())
    .make();

/* `StoryPage` will render received props or, rather, pass
** them to other lower level components like autoexample
*/
const StoryPage = ({
  metadata,
  config,
  component,
  componentProps,
  componentPath,
  hiddenProps,
  readOnlyProps,
  HOCProps,
  componentReadme,
  usageReadme,
  styleReadme,
  displayName,
  exampleProps,
  exampleImport,
  examples,
  codeExample
}) => {
  const visibleDisplayName = displayName || metadata.displayName;

  if (HOCProps) {
    let keys = Object.keys(HOCProps);

    for (let i = 0; i < keys.length; i++) {
      if (!componentProps[keys[i]]) {
        componentProps[keys[i]] = HOCProps[keys[i]].initialValue;
      }

      if (!metadata.props[keys[i]]) {
        metadata.props[keys[i]] = {
          description: HOCProps[keys[i]].description,
          required: HOCProps[keys[i]].required,
          type: HOCProps[keys[i]].type
        };
      }
    }
  }

  const visibleMetadata = {
    ...metadata,
    hiddenProps,
    readOnlyProps,
    displayName: visibleDisplayName,
    props: omit(metadata.props)(prop => hiddenProps.includes(prop))
  };

  let componentURL = componentPath.split("lib/");
  componentURL = componentURL[componentURL.length - 1];

  const codeTab = (
    <div>
      <Grid columns="equal">
        <Grid.Column>
          <div>
            <Markdown source={`# \`<${visibleDisplayName}/>\``} type="header" />
          </div>
        </Grid.Column>

        <Grid.Column>
          {(displayName || metadata.displayName) && (
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <a
                style={{ fontSize: "20px", color: "rgb(56, 153, 236)" }}
                href={`${config.repoBaseURL}${componentURL}`}
                target="_blank"
              >
                View source
              </a>
            </div>
          )}
        </Grid.Column>
      </Grid>

      <Divider />

      <CodeBlock
        style={{ marginTop: "10px" }}
        source={importString({
          config,
          metadata: visibleMetadata,
          exampleImport
        })}
      />

      {componentReadme && (
        <div>
          <Divider />
          <Markdown source={componentReadme} />
        </div>
      )}

      <Divider style={{ marginBottom: "24px" }} />

      <AutoExample
        component={component}
        parsedSource={visibleMetadata}
        componentProps={componentProps}
        exampleProps={exampleProps}
        codeExample={codeExample}
      />

      {examples && (
        <div>
          <Divider />
          <Header as="h2" style={{ margin: "-6px 0px 6px" }}>
            Examples
          </Header>
          {examples}
        </div>
      )}
    </div>
  );

  const panes = [
    {
      menuItem: "Code",
      render: () => <Tab.Pane attached={false}>{codeTab}</Tab.Pane>
    },
    {
      menuItem: "API",
      render: () => (
        <Tab.Pane attached={false}>
          <AutoDocs parsedSource={visibleMetadata} />
        </Tab.Pane>
      )
    },
    usageReadme
      ? {
          menuItem: "Usage",
          render: () => (
            <Tab.Pane attached={false}>
              <Markdown source={usageReadme} />
            </Tab.Pane>
          )
        }
      : null,
    styleReadme
      ? {
          menuItem: "Style",
          render: () => (
            <Tab.Pane attached={false}>
              <Markdown source={styleReadme} />
            </Tab.Pane>
          )
        }
      : null
  ];

  return <Tab menu={{ secondary: true, pointing: true }} panes={panes} />;
};

StoryPage.propTypes = {
  metadata: PropTypes.object,
  config: PropTypes.shape({
    importFormat: PropTypes.string,
    moduleName: PropTypes.string,
    repoBaseURL: PropTypes.string
  }),
  component: PropTypes.any,
  componentProps: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  componentPath: PropTypes.any,
  hiddenProps: PropTypes.array,
  readOnlyProps: PropTypes.array,
  HOCProps: PropTypes.any,
  usageReadme: PropTypes.any,
  styleReadme: PropTypes.any,
  componentReadme: PropTypes.any,
  displayName: PropTypes.string,
  exampleProps: PropTypes.object,
  exampleImport: PropTypes.string,
  examples: PropTypes.node,
  codeExample: PropTypes.bool
};

StoryPage.defaultProps = {
  config: {
    importFormat: ""
  },
  hiddenProps: [],
  readOnlyProps: []
};

export default StoryPage;
