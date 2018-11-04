# YAGPT (yet another general purpose tool)
- using gitflow: https://www.atlassian.com/git/tutorials/comparing-workflows

# Docs
[installation](docs/installation.md) | [features](docs/features.md) | [software design](docs/software-design.md) | [styleguide](docs/styleguide.md) | [Design Notes](docs/designNotes.md)

# INSTALLATION 
For detailed instructions on how to install nodejs/npm see [installation](docs/installation.md)
``` 
npm install dm-tpl -g
# or
npm install dm-tpl --save-dev
```

# FEATURES (Technique)
- [x] testing: mocha with livereload (```npm run test:watch```)
- [x] code coverage: nyc with livereload (```npm run coverage:watch```)
- [x] typescript: class based
- [x] gitflow
- [x] typescript: run via ts-node with livereload (```npm run start:watch```)
- [x] documentation: [typedoc](https://github.com/TypeStrong/typedoc/blob/master/examples/basic/src/classes.ts)
- [ ] debugging: ???
- [ ] continous integration: ???

# Workflows
- gitflow (TODO: document)
- monorepo (TODO: document)
- issuemanagement (TODO: document)

# SYSTEM DESIGN

## Utility Classes
- offer Helper functions for Tasks
- these functions are really basic and each can be viewed as a step of tasks

## Task Classes
- extend the TaskUtility Class which offers helperfunctions for running a task
  - runBefore(): logs the name and the start time of a task
  - runAfter(): logs the end time and duration of a task
- implement the TaskInterface
  - run(): have a run function, which runs the steps of the task
  - check(): have a check function, which checks, if all prerequisites for
    running the task are met
- are using the functions of Uitility Classes to solve multistep tasks

