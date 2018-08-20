import React from "react";
import PropTypes from "prop-types";
import { Grid } from "semantic-ui-react";
import Markdown from "../../Markdown";
// import styles from "./styles.scss";
const styles = {};

const Option = ({
  label,
  value,
  children,
  onChange,
  defaultValue,
  required,
  datahook
}) =>
  children ? (
    <Grid columns="equal" datahook={datahook} className={styles.option}>
      <Grid.Column width={6}>
        <Markdown source={`\`${label}${required ? "*" : ""}\``} />
      </Grid.Column>

      <Grid.Column>
        {React.cloneElement(children, {
          value: children.type === "div" ? value.toString() : value,
          defaultValue,
          onChange,

          // this is a hack to prevent warning im sorry, hopefully temporary,TODO
          ...(children.type === "div" ? {} : { required })
        })}
      </Grid.Column>
    </Grid>
  ) : null;

Option.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  children: PropTypes.node,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  datahook: PropTypes.string
};

export default Option;
