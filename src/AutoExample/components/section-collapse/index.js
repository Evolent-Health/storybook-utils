import React from "react";
import PropTypes from "prop-types";
import Collapse from "react-collapse";
import { Header, Grid } from "semantic-ui-react";

export default class PropsCollapse extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    children: PropTypes.node
  };

  static defaultProps = {
    isOpen: false
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen
    };
  }

  toggleCollapse = () => this.setState({ isOpen: !this.state.isOpen });

  getNumChildren = () => Object.keys(this.props.children).length;

  render() {
    return (
      <div>
        <Grid
          columns="equal"
          onClick={this.toggleCollapse}
          style={{
            margin: "0px 0px 12px",
            borderBottom: "1px solid #22242626"
          }}
        >
          <Grid.Column style={{ paddingLeft: "0px" }}>
            <Header as="h2"> {this.props.title} </Header>
          </Grid.Column>

          <Grid.Column>
            <div style={{ color: "rgb(56, 153, 236)" }}>
              {this.state.isOpen ? "Hide" : "Expand"}
            </div>
          </Grid.Column>
        </Grid>

        <Collapse isOpened={this.state.isOpen}>{this.props.children}</Collapse>
      </div>
    );
  }
}
