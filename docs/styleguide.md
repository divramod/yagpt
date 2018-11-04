# Styleguide
This will become the styleguide i will use every of my new projects.
- see: https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/capitalization-conventions
- see: https://softwareengineering.stackexchange.com/questions/143302/what-are-the-names-for-various-forms-of-camel-case-style-naming
- see: https://medium.com/@jonyeezs/hey-typescript-wheres-my-i-prefixed-interface-cd70efa10bd1

# Naming
```
// require: screaming snake case
const SHELL = require('shelljs')

// not changing variables: screaming snake case
const SOME_CONSTANT_VARIABLE = 'test'

// changing variables: camel case
let someChangingVariable = 'test'

// classes: pascal case
class SomeUtility

// objects of classes: screaming snake case
const TASK_1 = new NpmPublishTask()

// interfaces
interface IToolUtility

// TODO: functions

// TODO: exports
```

# Code

## Classes (TODO)
- every Utility must implement an Interface
