# YAGPT (yet another general purpose tool)
- using gitflow: https://www.atlassian.com/git/tutorials/comparing-workflows

# INSTALLATION 
``` 
npm install dm-tpl -g
# or
npm install dm-tpl --save-dev
```

# FEATURES (Technique)
- [x] programatic mocha testing with livereload (```npm run test:watch```)
- [x] nyc code coverage with livereload (```npm run coverage:watch```)
- [x] class based typescript
- [x] gitflow support 
- [x] run via ts-node with livereload (```npm run start:watch```)
- [ ] node debugger
- [ ] ci

# Features (Business)
- npm
  - [ ] publish release
- gitflow
  - [ ] publish release
  - [ ] create hotfix
  - [ ] publish hotfix
  - [ ] create feature

# SYSTEM DESIGN

## Utility
- offer Helper functions for Tasks

## Tasks
- have a run and a checkIsRunnable function
- use Utility functions

# DESIGN DECISIONS
- Overall, i want to reduce the complexity of the system as much as possible to
avoid overengeneering.
- Complexity is anything related to the structure of a software system that 
  makes it hard to understand and modify the system.
- One of the most important goals of good design is for a system to be obvious!
- Complexity is caused by two things: dependencies and obscurity
- 3 sympthoms of complexity
  1. Change amplification (have to change code on many different places to reach
     goal)
  2. Cognitive Load (you have to invest time to understand code)
  3. Unknown unknowns

## Tactical vs Strategic Programming
- use strategic programming

## Deep Modules
- create deep modules (easy interfaces, complexity should be in the 
  implementation)
- An abstraction is a simplified view of an entity, which omits unimportant 
  details.

## Information Hiding and Leakage
- The most important technique for achieving deep modules is information hiding
- The best form of information hiding is when information is totally hidden 
  within a module, so that it is irrelevant and invisible to users of the module
- Try to combine classes who depend on the same thing
- One of the best skills you can learn as a software designer is a high level 
  of sensitivity to information leakage
- avoid Temporal decomposition: When designing modules, focus on the knowledge 
  that’s needed to perform each task, not the order in which tasks occur.
- Information hiding can often be improved by making a class slightly larger.
- Reduce the number of instance variables in classes
- It’s important to recognize which information are needed outside a module and
  expose them
- RED FLAG: IF the API for a commonly used feature forces users to learn about 
  other features that are rarely used, this increases the cognitive load on 
  users who don’t need the rarely used features.


## General-Purpose Modules
- General-purpose consistent with the thought of designing upfront, saving time
  later
- One of the most important elements of software design is determining who needs
  to know what, and when
- Q: What is the simplest interface that will cover all my current needs?
- Q: In how many situations will this method be used?
- Q: Is this API easy to use for my current needs?

## Different Layer, Different Abstraction
- Avoid Pass-through methods
- Merge classes
- Divide methods
- Expose methods to caller
- RED FLAG: A pass-through method is one that does nothing except pass its
  arguments to another method, usually with the same API as the pass-through
  method. This typically indicates that there is not a clean division of 
  responsibility between the classes.


## Pull complexity downwards
- It is more important for a module to have a simple interface that a simple 
  implementation
- It is better to solve the problems instead of throwing errors/exceptions
- avoid configuration parameters as much as possible

## Better together or apart
- Bring together if information is shared
- Bring together if it will simplify the interface
- Bring together to eliminate duplication
- RED FLAG: Repetition: If the same piece of code (or code that is almost the
  same) appears over and over again, that’s a read flag that you haven’t found
  the right abstractions.
- RED FLAG: Special-General Mixture: This red flag occurs when a general-purpose
  mechanism also contains code specialized for a particular use of that 
  mechanism. This makes the mechanism more complicated and creates information
  leakage between the mechanism and the particular use case: future modifications
  to the use case are likely to require changes to the underlying mechanism as
  well.
- RED FLAG: Conjoined Methods: It should be possible to understand each method
  independently. If you can’t understand the implementation of one method without
  also understanding the implementation of another, that’s a red flag. This red
  flag can occur in other contexts as well: if two pieces of code are physically
  separated, but each can only be understood by looking at the other, thats a 
  red flag.

##  Error Handling
- use Error masking, where possible
- use Error aggregation where possible
- avoid error-ful design, favor "design errors out of existence approach"
- use Just crash approach for cases, where system would be in an inconsistant 
  state
