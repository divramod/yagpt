# YAGPT (yet another general purpose tool)
This is hopefully the last npm package i write. In the last years i every once
in a while created a npm package for solving specific tasks i had to do on a
regular basis. Usually, at some point in time I forgot about the package and
then later, as i faced the problem again, somehow wasn't able to find the
package i had created ealier. This is why i then usually created a new one and
reinvented my wheels again. So this time i voted for the monorepo-approach with
the hope of avoiding that old problem and being able to keep the whole package
on a modern standard with less effort.

So this package is a combination of a task-runner and a project-manager. I will
add features over time and besides my implement-on-linux-first-approach, try
to make it usable on windows/mac and maybe later others too.

Shortly after starting the project i read the book, "A Philosophy of Software
Design" by John Ousterhout. The book elevated my skilllevels in programming
and software design really a lot, why i wanted to mention it here. The book
influenced a lot of design-decisions i made for that package.

I intend to use the work on this package for:
1. learning new techniques
2. becoming a better software-designer/-architect and programmer
3. creating automatisms for tasks i have to do regularly
4. beeing a template/styleguide for projects i will do in collaboration with
   other programmers.

# DOCS
- [installation](docs/installation.md):
  Detailed installation instructions.
- [features](docs/features.md):
  A list of features the package offers.
- [styleguide](docs/styleguide.md):
  The Style decisions i made for the package.
- [design notes](docs/designNotes.md):
  A list of notes which explain, which design decisions i made for the project
  and which thoughts drove them.
- [user manual](docs/userManual.md):
  Explains how yagpt is concipated and how to use it.
- [a philosophy of software design](docs/aPhilosophyOfSoftwareDesign.md):
  Excerpts i collected from Reading the Book "A Philosophy of Software Design"
  by John Ousterhout.

# FEATURES (Technique)
- [x] testing: [mochajs](https://mochajs.org/) with livereload
      (```npm run test:watch```)
- [x] 100% code coverage: [istanbuljs](https://istanbul.js.org) with
      [nyc](https://github.com/istanbuljs/nyc) with livereload
      (```npm run coverage:watch```)
- [x] typescript: run via [ts-node](https://github.com/TypeStrong/ts-node) with
      livereload (```npm run start:watch```)
- [x] documentation: [typedoc](https://github.com/TypeStrong/typedoc/blob/master/examples/basic/src/classes.ts)
- [x] [tslint](https://palantir.github.io/tslint): lints the code
- [ ] debugging: ???
- [ ] continous integration: ???

# WORKFLOWS/PROJECTORGANISATION
- [gitflow for git](https://www.atlassian.com/git/tutorials/comparing-workflows)
- monorepo (TODO: document)
- issuemanagement on github (TODO: document)

# INSTALLATION
For detailed instructions on how to install nodejs/npm and other tools used by
the package, see [installation](docs/installation.md):
```
npm install yagpt -g
# or
npm install yagpt --save-dev
```
