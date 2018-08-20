import React, { Component } from "react";
import PropTypes from "prop-types";
import copy from "copy-to-clipboard";
import TextButton from "../TextButton";
import Markdown from "../Markdown";

const toCodeBlock = (code, type = "js") =>
  ["```" + type, code.trim(), "```"].join("\n");

export default class CodeBlock extends Component {
  static propTypes = {
    source: PropTypes.string,
    type: PropTypes.string,
    datahook: PropTypes.string
  };

  static defaultProps = {
    type: "js"
  };

  state = {
    showNotification: false
  };

  onCopyClick = () => {
    copy(this.props.source);
    this.setState({ showNotification: true });
  };

  render() {
    const { source, type, datahook } = this.props;

    return (
      <div data-hook={datahook}>
        <TextButton onClick={this.onCopyClick}>Copy to clipboard</TextButton>

        <Markdown source={toCodeBlock(source, type)} />
      </div>
    );
  }
}
