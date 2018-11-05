# YAGPT (yet another general purpose tool)
This is hopefully the last npm package i write. In the last years i every once
in a while created a npm package for solving specific tasks, i had to do on a
regular basis. Usually, at some point in time I forgot about the package and
then later, as i faced the problem again, somehow wasn't able to find the
package i had created ealier. This is why i created a new one and had to
reinvent my wheels again. So this time i voted for the monorepo-approach with
the hope to avoid that old problem and be able to keep the whole package on a
modern standard, because i see everything at once.

So this package is a combination of a task-runner and a project-manager. I will
add features over time and besides my implement-on-linux-first-principle, try
to make it usable on windows/mac and maybe later others too.

Shortly after starting the project i read the book, "A Philosophy of Software
Design" by John Ousterhout. The book elevated my skilllevels in programming
and software design really a lot, why i wanted to mention it here. The book
influenced a lot of design-decisions i made for that package.

I intend to use the work on this package for:
1. learning new techniques
2. becoming a better software-designer/-architect and programmer
3. creating automatisms for tasks i have to do regularly
4. beeing a template/styleguide for projects i will do in collaboratin with
   other programmers.

# Docs
- [installation](docs/installation.md):
  Detailed installation intructions.
- [features](docs/features.md):
  A list of features, the package has.
- [styleguide](docs/styleguide.md):
  The Style decisions i made for the package.
- [design notes](docs/designNotes.md):
  A list of notes, which explain, which design decisions i made for the project
  and which thoughts drove them.
- [projects](docs/projects.md):
  A list of projects, with which the package should help me.
- [a philosophy of software design](docs/aPhilosophyOfSoftwareDesign.md):
  Excerpts i collected from Reading the Book "A Philosophy of Software Design"
  by John Ousterhout.

# INSTALLATION 
For detailed instructions on how to install nodejs/npm and other tools used by
the package, see [installation](docs/installation.md):
```
npm install dm-tpl -g
# or
npm install dm-tpl --save-dev
```

# FEATURES (Technique)
- [x] testing: mocha with livereload (```npm run test:watch```)
- [x] 100% code coverage: nyc with livereload (```npm run coverage:watch```)
- [x] typescript: class based
- [x] gitflow
- [x] typescript: run via ts-node with livereload (```npm run start:watch```)
- [x] documentation: [typedoc](https://github.com/TypeStrong/typedoc/blob/master
/examples/basic/src/classes.ts)
- [x] tslint: lints the code
- [ ] debugging: ???
- [ ] continous integration: ???

# Workflows/Projectorganisation
- [gitflow for git](https://www.atlassian.com/git/tutorials/comparing-workflows)
- monorepo (TODO: document)
- issuemanagement on github (TODO: document)
