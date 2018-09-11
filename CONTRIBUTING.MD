# Contributing

By contributing code to this project, you affirm that it is your original work and implicitly grant permission for it to be distributed under the [AGPL-3.0](LICENSE) license.

Read about how you can earn XUC for your contributions in our [how-to guide](https://github.com/ExchangeUnion/Docs/blob/master/How-to-contribute.md).

## Contribution Guidelines

If you are new to contributing to open sources projects on GitHub, check out [this how-to](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github/).

### Feature Branches & Pull Requests

We use [feature branches](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) for development. Each branch and pull request should focus on a particular feature or issue. Ensure that new branches are created from the latest code in `master`. A branch must be approved by a user with commit access and must pass automated regression tests and lint checks before it can be merged into `master`.

Pull requests will be reviewed and changes may be requested. If changes are required, make new commits directly to the feature branch. If there have been conflicting commits to `master` since a feature branch was created, either merge master into the branch or rebase the branch onto master using `git rebase`.

When multiple commmits pertain to the same issue or feature, uou should squash then into a single commit or a maintainer will squash them before merging. For more complex pull requests that touch many parts of the code or implement multiple distinct changes to the code, please collapse commits according to their scope and affected changes. This can be performed through an interactive rebase with `git rebase -i`. Use `git commit --amend` when fixing minor typos or bugs with the most recent commit. These practices help maintain a clean and coherent commit history while preserving contribution authorship.

### Commit Messages

Commit messages should follow the [AngularJS Commit Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines). The message header should start by specifying the type of change the commit implements, followed by the scope of the change in parentheses, and then a subject message summarizing the change. For example: `fix(orderbook): remove orders with 0 quantity`. The body of the commit message should elaborate on the changes and explain the motivation for the change.

A git commit template is provided to assist with crafting proper commit messsages. You can enable it by running the following command in the folder where you have cloned `xud`:

```shell
git config commit.template .git-commit-template.txt
```

### Linting & Testing

New test cases are appreciated for any pull requests that changes or adds new functionality. Although the current test suites are in early stages, thorough testing and code coverage is an important long term goal.

All code is linted with [tslint](https://github.com/palantir/tslint) using a slightly modified [tslint adaptation](https://github.com/progre/tslint-config-airbnb) of [Airbnb's javascript style guide](https://github.com/airbnb/javascript). Ensure that your contributions pass all linting rules by running `npm run lint` or using a code editor with a tslint plugin. Per-line or per-file exceptions to linting rules are allowable in certain cases.

### Commenting & Documentation

Make your code legible by using descriptive variable, function, and class names. For blocks of codes, variables, and methods whose purpose is not readily apparent, add comments explaining what they do.

Xud uses [TypeDoc](http://typedoc.org/guides/doccomments/) and follows the [Oracle Javadoc Style Guide](https://www.oracle.com/technetwork/java/javase/documentation/index-137868.html#styleguide) - any comments documenting specific classes, methods, properties should follow this convention.
