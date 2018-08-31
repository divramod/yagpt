# YAGPT (yet another general purpose tool)
- using gitflow: https://www.atlassian.com/git/tutorials/comparing-workflows

# Install
```
npm install dm-tpl -g
# or
npm install dm-tpl --save-dev
```

# UPDATE
- proof if repository clean

```
// add and commit changes
git add -A
git commit

// try to merge develop
git pull origin develop
git merge develop

// push changes
git push -u origin HEAD

// merge into develop and push
git checkout develop
git merge feature/...
git push -u origin HEAD

// create release / tag
git checkout release/0.1.1
semver -i patch
git add -A
git commit -m "RELEASE 0.1.1"
git push -u origin HEAD

// merge release to master
git checkout master
git merge release/0.1.1
git push -u origin HEAD

// create tag
git tag -a v0.1.1 -m "TAG 0.1.1"

// checkout master
git checkout master

// npm publish
npm publish

// npm link
```

# FEATURES

## Technical Features
- [x] programatic mocha testing with livereload (```npm run test:watch```)
- [x] nyc code coverage with livereload (```npm run coverage:watch```)
- [x] class based typescript
- [x] gitflow support 
- [x] run via ts-node with livereload (```npm run start:watch```)
- [ ] node debugger
- [ ] ci

## Workflow Features
- npm
  - [ ] publish release
- gitflow
  - [ ] publish release
  - [ ] create hotfix
  - [ ] publish hotfix
  - [ ] create feature

# TODO: USAGE

# Utility vs Tasks

## Utility
- are [Singletons](https://stackoverflow.com/questions/30174078/how-to-define-singleton-in-typescript)
- offer Helper functions

## Tasks
- have a run function
- use Utility functions
