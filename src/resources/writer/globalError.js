const globalError = (str) => ({
  errors: {
    _global: [str],
  },
});

module.exports = globalError;
