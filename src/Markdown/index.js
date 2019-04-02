const ReactMarkdown = require('react-markdown/with-html')

export default class Markdown extends Component {
  static propTypes = {
    source: PropTypes.string,
    type: PropTypes.string
  };

  render() {
    return (
      <ReactMarkdown
      source={this.props.source.trim()}
      escapeHtml={false}
    />
    );
  }
}


/*
import React, { Component } from "react";
import PropTypes from "prop-types";
import Remarkable from "react-remarkable";
import hljs from "highlight.js/lib/highlight.js";
import "./style.scss";

hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript.js'));

hljs.registerLanguage('typescript', require('highlight.js/lib/languages/typescript.js'));

hljs.registerLanguage('css', require('highlight.js/lib/languages/css.js'));

hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss.js'));

hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml.js'));

hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash.js'));

hljs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown.js'));

hljs.registerLanguage('django', require('highlight.js/lib/languages/django.js'));

export default class Markdown extends Component {
  static propTypes = {
    source: PropTypes.string,
    type: PropTypes.string
  };

  render() {
    if (global.self === global.top) {
      return null;
    }

    const options = {
      html: true,
      linkTarget: '_parent',
      highlight: (code, lang) => hljs.highlight(lang, code).value,
    };

    return (
      <div className={className || 'markdown-body'}>
        <Remarkable source={this.props.source.trim()} options={options} />
      </div>
    );
  }
}
*/