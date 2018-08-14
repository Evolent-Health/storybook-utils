module.exports = {
    parser: "babel-eslint",
    globals: {
      jasmine: false,
      it: false,
      expect: false,
      spyOn: false,
      describe: false,
      beforeEach: false,
      afterEach: false,
      asyncTest: false,
      __DEV__: false,
      requestAnimationFrame: false,
      angular: true,
      inject: true,
      browser: true,
      by: true,
      element: true,
      protractor: true
    },
  
    plugins: ["react", "standard", "protractor"],
  
    extends: ["standard", "standard-react", "plugin:prettier/recommended"],
  
    rules: {
      "quote-props": ["error", "as-needed"],
      "no-unused-vars": [
        "error",
        { vars: "all", args: "after-used", ignoreRestSiblings: true }
      ],
      "react/no-unused-prop-types": [1],
      "standard/computed-property-even-spacing": 0
    },
    env: {
      jest: true,
      browser: true
    }
  };
  