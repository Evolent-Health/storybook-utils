import React from 'react';
import PropTypes from 'prop-types';
import Collapse from 'react-collapse';

import { Header, Grid } from "semantic-ui-react";

export default class PropsCollapse extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    children: PropTypes.node
  }

  static defaultProps = {
    isOpen: false
  }

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen
    };
  }

  toggleCollapse = () =>
    this.setState({isOpen: !this.state.isOpen});

  getNumChildren = () =>
    Object.keys(this.props.children).length;

  render() {
    return (
      <div>
        <div onClick={this.toggleCollapse} >
          <Header as="h2">
            {this.props.title}
          </Header>

          <div>
            { this.state.isOpen ? 'Hide' : 'Expand' }
          </div>
        </div>

        <Collapse isOpened={this.state.isOpen}>
          {this.props.children}
        </Collapse>
      </div>
    );
  }
}
