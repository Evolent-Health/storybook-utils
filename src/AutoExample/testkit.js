import React from "react";
import { mount } from "enzyme";

import { Option, Code } from "./components";

export default class AutoExampleTestkit {
  constructor(AutoExample) {
    this.AutoExample = AutoExample;
  }

  component;

  /* eslint-disable */
  when = {
    created: props =>
      this.component = mount(<this.AutoExample {...props}/>)
  };
  /* eslint-enable */

  get = {
    options: () => this.component.find(Option),
    codeBlock: () => this.component.find(Code)
  };
}
