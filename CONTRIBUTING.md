<!-- This file is automatically added by @npmcli/template-oss. Do not edit. -->

# Contributing

## Code of Conduct

All interactions in the **npm** organization on GitHub are considered to be covered by our standard [Code of Conduct](https://docs.npmjs.com/policies/conduct).

## Reporting Bugs

Before submitting a new bug report please search for an existing or similar report.

Use one of our existing issue templates if you believe you've come across a unique problem.

Duplicate issues, or issues that don't use one of our templates may get closed without a response.

## Pull Request Conventions

### Commits

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

When opening a pull request please be sure that either the pull request title, or each commit in the pull request, has one of the following prefixes:

 - `feat`: For when introducing a new feature.  The result will be a new semver minor version of the package when it is next published.
 - `fix`: For bug fixes. The result will be a new semver patch version of the package when it is next published.
 - `docs`: For documentation updates.  The result will be a new semver patch version of the package when it is next published.
 - `chore`: For changes that do not affect the published module.  Often these are changes to tests.  The result will be *no* change to the version of the package when it is next published (as the commit does not affect the published version).

### Test Coverage

Pull requests made against this repo will run `npm test` automatically.  Please make sure tests pass locally before submitting a PR.

Every new feature or bug fix should come with a corresponding test or tests that validate the solutions. Testing also reports on code coverage and will fail if code coverage drops.

### Linting

Linting is also done automatically once tests pass.  `npm run lintfix` will fix most linting errors automatically.

Please make sure linting passes before submitting a PR.

## What _not_ to contribute?

### Dependencies

It should be noted that our team does not accept third-party dependency updates/PRs.  If you submit a PR trying to update our dependencies we will close it with or without a reference to these contribution guidelines.

### Tools/Automation

Our core team is responsible for the maintenance of the tooling/automation in this project and we ask contributors to not make changes to these when contributing (e.g. `.github/*`, `.eslintrc.json`, `.licensee.json`).  Most of those files also have a header at the top to remind folks they are automatically generated.  Pull requests that alter these will not be accepted.
