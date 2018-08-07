import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Tab, Divider } from 'semantic-ui-react';
import Markdown from '../Markdown';
import AutoDocs from '../AutoDocs';
import CodeBlock from '../CodeBlock';
import AutoExample from '../AutoExample';
import omit from '../AutoExample/utils/omit';
import 'semantic-ui-less/semantic.less';

const importString = ({metadata, config, exampleImport}) =>
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
            new RegExp('%(' + Object.keys(config).join('|') + ')', 'g'),
            (match, configKey) => config[configKey] || ''
          )
    },
    {
      when: () => true,
      make: () => `import { ${metadata.displayName} } from '${config.moduleName}';`
    }
  ].find(({when}) => when()).make();

const StoryPage = ({
  metadata,
  config,
  component,
  componentProps,
  hiddenProps,
  readOnlyProps,
  displayName,
  exampleProps,
  exampleImport,
  examples,
  codeExample
}) => {
  const visibleDisplayName = displayName || metadata.displayName;
  
  const visibleMetadata = {
    ...metadata,
    hiddenProps,
    readOnlyProps,
    displayName: visibleDisplayName,
    props: omit(metadata.props)(prop => hiddenProps.includes(prop))
  };

  let renderedComponent = React.createElement(component, componentProps);

  let componentURL;

  for (let i = 0; i < config.componentPaths.length; i++) {
    if (config.componentPaths[i][0] === visibleDisplayName) {
      componentURL = config.componentPaths[i][1];
    }
  }

  

  let usageTab = (
    <div>
      <Grid columns='equal'>
        <Grid.Column>
          <div>
            <Markdown
              source={`# \`<${visibleDisplayName}/>\``}
            />
          </div>
        </Grid.Column>
        <Grid.Column>
          { (displayName || metadata.displayName) &&
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <a
                style={{ fontSize: "20px", color: "rgb(56, 153, 236)" }}
                href={`${config.repoBaseURL}${componentURL}`}
                target="_blank"
                >
                View source
              </a>
            </div>
          }
        </Grid.Column>
      </Grid>
      <Divider />

      {metadata.readme ?
        <div>
          <Markdown
            source={metadata.readme}
          />
          <Divider />
        </div>
        :
        null
      }

      <CodeBlock
        style={{ marginTop: "10px" }}
        source={importString({
          config,
          metadata: visibleMetadata,
          exampleImport
        })}
      />
      <Divider />
      
      <AutoExample
        component={component}
        parsedSource={visibleMetadata}
        componentProps={componentProps}
        exampleProps={exampleProps}
        codeExample={codeExample}
        />

    </div>
  );

  const panes = [
    { menuItem: 'Usage', render: () => <Tab.Pane attached={false}>{usageTab}</Tab.Pane> },
    { menuItem: 'API', render: () => <Tab.Pane attached={false}><AutoDocs parsedSource={visibleMetadata}/></Tab.Pane> },
    (metadata.readmeTestkit ? { menuItem: 'Testkit', render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane> } : null),
    (metadata.readmeAccessibility ? { menuItem: 'Accessibility', render: () => <Tab.Pane attached={false}>Tab 4 Content</Tab.Pane> } : null),
  ];

  return (
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />


    /*
    <TabbedView tabs={tabs(metadata)}>
      <div className={styles.usage}>
        

        <CodeBlock
          dataHook="metadata-import"
          source={importString({
            config,
            metadata: visibleMetadata,
            exampleImport
          })}
          />

        <Section title="Playground">
          <AutoExample
            component={component}
            parsedSource={visibleMetadata}
            componentProps={componentProps}
            exampleProps={exampleProps}
            codeExample={codeExample}
            />
        </Section>

        { examples &&
          <Section title="Examples">
            {examples}
          </Section>
         }
      </div>

      <AutoDocs parsedSource={visibleMetadata}/>

      { metadata.readmeTestkit && <Markdown source={metadata.readmeTestkit}/> }

      { metadata.readmeAccessibility && <Markdown source={metadata.readmeAccessibility}/> }
    </TabbedView>
    */
  );
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
  hiddenProps: PropTypes.array,
  readOnlyProps: PropTypes.array,
  displayName: PropTypes.string,
  exampleProps: PropTypes.object,

  /** custom string to be displayed in place of import example
   * usually something like `import Component from 'module/Component';`
   */
  exampleImport: PropTypes.string,
  examples: PropTypes.node,

  /** currently only `false` possible. later same property shall be used for configuring code example */
  codeExample: PropTypes.bool
};

StoryPage.defaultProps = {
  config: {
    importFormat: ''
  },
  hiddenProps: [],
  readOnlyProps: []
};

export default StoryPage;
