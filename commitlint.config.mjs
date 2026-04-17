// commitlint.config.mjs
// Conventional commit rules for the POC app repo.
// Place this file at the root of your app repo.

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed commit types — aligned with your CI/CD branching model
    'type-enum': [2, 'always', [
      'feat',      // new feature
      'fix',       // bug fix
      'hotfix',    // emergency production fix
      'chore',     // maintenance task, no production change
      'ci',        // CI/CD pipeline changes
      'docs',      // documentation only
      'refactor',  // code restructure without feature/fix
      'test',      // adding or updating tests
      'revert',    // revert a previous commit
    ]],
    // Warn (not error) if subject line exceeds 100 chars
    'header-max-length': [1, 'always', 100],
    // Subject must not end with a period
    'subject-full-stop': [2, 'never', '.'],
    // Subject must be in lower-case
    'subject-case': [2, 'always', 'lower-case'],
  }
}
