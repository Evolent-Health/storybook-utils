import React, { Component } from "react";
import PropTypes from "prop-types";
import NO_VALUE_TYPE from "./no-value-type";
import categorizeProps from "./categorize-props";
import { Grid, Divider, Container } from "semantic-ui-react";
import { Option, Preview, Code, Toggle, CustomInput, List } from "./components";
import SectionCollapse from "./components/section-collapse";
import matchFuncProp from "./utils/match-func-prop";
// import stripQuotes from "./utils/strip-quotes";
// import omit from "./utils/omit";
import ensureRegexp from "./utils/ensure-regexp";
// import styles from "./styles.scss";
let styles = {};

export default class extends Component {
  static displayName = "AutoExample";

  static propTypes = {
    // Generated by `react-autodocs-utils`
    parsedSource: PropTypes.object,
    // Reference to react component
    component: PropTypes.func,
    // Control default props and their state of component in preview.
    componentProps: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    exampleProps: PropTypes.object,
    // When true, display only component preview without interactive props nor code example
    isInteractive: PropTypes.bool,
    codeExample: PropTypes.bool
  };

  static defaultProps = {
    source: "",
    component: () => null,
    componentProps: {},
    parsedSource: {},
    exampleProps: {},
    isInteractive: true,
    codeExample: true
  };

  _initialPropsState = {};
  _categorizedProps = [];

  constructor(props) {
    super(props);
    this.parsedComponent = props.parsedSource;
    this.preparedComponentProps = this.prepareComponentProps(
      this.props.componentProps
    );

    this.state = {
      propsState: {
        ...(this.props.component.defaultProps || {}),
        ...this.preparedComponentProps
      },
      funcValues: {},
      funcAnimate: {}
    };

    this._initialPropsState = this.state.propsState;

    // Remove "hidden" props from render list
    this._tracedProps = {
      ...this.preparedComponentProps,
      ...this.parsedComponent.props
    };
    for (let i = 0; i < this.parsedComponent.hiddenProps.length; i++) {
      delete this._tracedProps[this.parsedComponent.hiddenProps[i]];
    }
    for (let i = 0; i < this.parsedComponent.readOnlyProps.length; i++) {
      delete this._tracedProps[this.parsedComponent.readOnlyProps[i]];
    }

    this._categorizedProps = Object.entries(
      categorizeProps(this._tracedProps, this.propsCategories)
    )
      .map(([, category]) => category)
      .sort(
        ({ order: aOrder = -1 }, { order: bOrder = -1 }) => aOrder - bOrder
      );
  }

  resetState = () => this.setState({ propsState: this._initialPropsState });

  componentWillReceiveProps(nextProps) {
    this.setState({
      propsState: {
        ...this.state.propsState,
        ...this.prepareComponentProps(nextProps.componentProps)
      }
    });
  }

  prepareComponentProps = props =>
    typeof props === "function"
      ? props(
          // setState
          componentProps =>
            this.setState({
              propsState: {
                ...this.state.propsState,
                ...componentProps
              }
            }),

          // getState
          () => this.state.propsState || {}
        )
      : props;

  setProp = (key, value) => {
    if (value === NO_VALUE_TYPE) {
      // eslint-disable-next-line no-unused-vars
      const { [key]: deletedKey, ...propsState } = this.state.propsState;
      this.setState({ propsState });
    } else {
      this.setState({
        propsState: {
          ...this.state.propsState,
          [key]: value
        }
      });
    }
  };

  propControllers = [
    {
      types: ["func", /event/, /\) => void$/],

      controller: ({ propKey }) => {
        let classNames = styles.example;

        if (this.state.funcAnimate[propKey]) {
          classNames += ` ${styles.active}`;
          setTimeout(
            () =>
              this.setState({
                funcAnimate: {
                  ...this.state.funcAnimate,
                  [propKey]: false
                }
              }),
            2000
          );
        }

        if (this.props.exampleProps[propKey]) {
          return (
            <div className={classNames}>
              {this.state.funcValues[propKey] || "Interaction preview"}
            </div>
          );
        }
      }
    },

    {
      types: ["bool", "Boolean"],
      controller: () => <Toggle />
    },

    {
      types: ["enum"],
      controller: ({ type }) => (
        // <List values={type.value.map(({value}) => stripQuotes(value))}/>
        <List values={type.value} />
      )
    },

    {
      types: [
        "string",
        "number",
        /ReactText/,
        "arrayOf",
        "union",
        "node",
        "ReactNode"
      ],
      controller: () => <CustomInput />
    }
  ];

  // TRACE ACTIONS FROM HERE
  getPropControlComponent = (propKey, type = {}) => {
    if (!matchFuncProp(type.name) && this.props.exampleProps[propKey]) {
      // console.log("HIT ONE");
      // console.log(this.props.exampleProps[propKey]);
      return <List values={this.props.exampleProps[propKey]} />;
    }

    const propControllerCandidate = this.propControllers.find(({ types }) =>
      types.some(t => ensureRegexp(t).test(type.name))
    );
    // console.log("HIT TWO");
    // console.log(propControllerCandidate);
    return propControllerCandidate && propControllerCandidate.controller ? (
      propControllerCandidate.controller({ propKey, type })
    ) : (
      <CustomInput />
    );
  };

  renderPropControllers = ({ props, allProps }) => {
    return Object.entries(props).map(([key, prop]) => (
      <Option
        key={key}
        {...{
          label: key,
          value: allProps[key],
          defaultValue:
            typeof this.props.componentProps === "function"
              ? undefined
              : this.props.componentProps[key],
          required: prop.required || false,
          onChange: value => this.setProp(key, value),
          children: this.getPropControlComponent(key, prop.type)
        }}
      />
    ));
  };

  propsCategories = {
    primary: {
      title: "Primary Props",
      order: 0,
      isOpen: true,
      matcher: name =>
        // Primary props are all those set in componentProps and exampleProps
        Object.keys({
          ...this.props.exampleProps,
          ...this.preparedComponentProps
        })
          .filter(name => !["on"].some(i => name.startsWith(i)))
          .filter(name => !this.parsedComponent.hiddenProps.includes(name))
          .filter(name => !this.parsedComponent.readOnlyProps.includes(name))
          .filter(
            name => !["data"].some(i => name.startsWith(i) && name !== "data")
          )
          .some(propName => propName === name)
    },

    events: {
      title: "Actions",
      order: 1,
      matcher: name =>
        // Callbacks (starts with `on`)
        name.toLowerCase().startsWith("on")
    },

    other: {
      // Other props are everything that doesn"t fit in other categories
      title: "Other Props",
      order: 2,
      matcher: () => true
    }
  };

  render() {
    const functionExampleProps = Object.keys(this.props.exampleProps).filter(
      prop =>
        this.parsedComponent.props[prop] &&
        matchFuncProp(this.parsedComponent.props[prop].type.name)
    );

    const componentProps = {
      ...this.state.propsState,
      ...functionExampleProps.reduce((acc, prop) => {
        acc[prop] = (...rest) => {
          if (this.state.propsState[prop]) {
            this.state.propsState[prop](...rest);
          }
          this.setState({
            funcValues: {
              ...this.state.funcValues,
              [prop]: this.props.exampleProps[prop](...rest)
            },
            funcAnimate: { ...this.state.funcAnimate, [prop]: true }
          });
        };
        return acc;
      }, {})
    };

    const codeProps = {
      ...this.state.propsState,
      ...functionExampleProps.reduce((acc, key) => {
        acc[key] = this.props.exampleProps[key];
        return acc;
      }, {})
    };

    if (!this.props.isInteractive) {
      return React.createElement(this.props.component, componentProps);
    }

    return (
      <Container fluid>
        <Grid columns="equal">
          <Grid.Column width={6}>
            {this._categorizedProps.reduce(
              (components, { title, isOpen, props }, i) => {
                const renderablePropControllers = this.renderPropControllers({
                  props,
                  allProps: componentProps // TODO: ideally this should not be here
                }).filter(({ props: { children } }) => children);

                return renderablePropControllers.length
                  ? components.concat(
                      React.createElement(SectionCollapse, {
                        key: title,
                        title,
                        isOpen: isOpen || i === 0,
                        children: renderablePropControllers
                      })
                    )
                  : components;
              },
              []
            )}
          </Grid.Column>

          <Grid.Column>
            <Preview
              children={React.createElement(
                this.props.component,
                componentProps
              )}
            />
          </Grid.Column>
        </Grid>

        <Divider />

        {this.props.codeExample && (
          <Code
            component={React.createElement(this.props.component, codeProps)}
          />
        )}
      </Container>
    );
  }
}
