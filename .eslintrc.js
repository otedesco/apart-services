module.exports = {
  root: true,
  extends: ['eslint-config-custom'],
  settings: {
    next: {
      rootDir: ['services/*/'],
    },
  },
};
