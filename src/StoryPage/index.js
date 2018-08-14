import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Tab, Divider, Header } from 'semantic-ui-react';
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
          .replace(/%componentName/g, '')
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

/* `StoryPage` will render received props or, rather, pass
** them to other lower level components like autoexample
*/
const StoryPage = ({
  metadata,
  config,
  component,
  componentProps,
  hiddenProps,
  readOnlyProps,
  componentReadme,
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

    let componentURL;
    for (let i = 0; i < config.componentPaths.length; i++) {
      if (config.componentPaths[i][0] === visibleDisplayName) {
        componentURL = config.componentPaths[i][1];
      }
    }

    const usageTab = (
      <div>
        <Grid columns="equal">
          <Grid.Column>
            <div>
              <Markdown
                source={`# \`<${visibleDisplayName}/>\``}
              />
            </div>
          </Grid.Column>

          <Grid.Column>
            { (displayName || metadata.displayName) &&
              <div style={{textAlign: 'right', marginTop: '8px'}}>
                <a
                  style={{fontSize: '20px', color: 'rgb(56, 153, 236)'}}
                  href={`${config.repoBaseURL}${componentURL}`}
                  target="_blank"
                  >
                  View source
                </a>
              </div>
            }
          </Grid.Column>
        </Grid>

        <Divider/>
    
        {/*metadata.readme &&
          <div>
            <Markdown
              source={metadata.readme}
            />
            <Divider/>
          </div>
        */}

        {componentReadme &&
          <div>
            <Markdown
              source={componentReadme}
            />
            <Divider/>
          </div>
        }

        <CodeBlock
          style={{marginTop: '10px'}}
          source={importString({
            config,
            metadata: visibleMetadata,
            exampleImport
          })}
        />
        
        <Divider/>

        <AutoExample
          component={component}
          parsedSource={visibleMetadata}
          componentProps={componentProps}
          exampleProps={exampleProps}
          codeExample={codeExample}
        />

        { examples &&
          <div>
            <Header as="h2">Examples</Header>
            <Divider/>
            {examples}
          </div>
        }
      </div>
    );

    const panes = [
      {
        menuItem: 'Usage', 
        render: () => <Tab.Pane attached={false}>{usageTab}</Tab.Pane>
      },
      {
        menuItem: 'API', 
        render: () => <Tab.Pane attached={false}><AutoDocs parsedSource={visibleMetadata}/></Tab.Pane>
      }
    ];

  return (
    <Tab menu={{secondary: true, pointing: true}} panes={panes}/>
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
  exampleImport: PropTypes.string,
  examples: PropTypes.node,
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
