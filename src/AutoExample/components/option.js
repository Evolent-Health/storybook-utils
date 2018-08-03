import React from 'react';
import PropTypes from 'prop-types';

//import {Row, Col} from 'wix-style-react/Grid';
import { Grid } from "semantic-ui-react";

import Markdown from '../../Markdown';
//import styles from './styles.scss';
let styles={}

const Option = ({
  label,
  value,
  children,
  onChange,
  defaultValue,
  required,
  dataHook
}) =>
  children ? (
    <Grid.Row
      dataHook={dataHook}
      className={styles.option}
      >
      <Grid.Column width={8}>
        <Markdown source={`\`${label}${required ? '*' : ''}\``}/>
      </Grid.Column>

      <Grid.Column width={8}>
        {React.cloneElement(children, {
          value: children.type === 'div' ? value.toString() : value,
          defaultValue,
          onChange,

          // this is a hack to prevent warning im sorry, hopefully temporary,TODO
          ...(children.type === 'div' ? {} : {required})
        })}
      </Grid.Column>
    </Grid.Row>
  ) : null;

Option.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  children: PropTypes.node,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  dataHook: PropTypes.string
};

export default Option;
