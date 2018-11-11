# Styleguide
This will become the styleguide i will use every of my new projects.
- see: https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/capitalization-conventions
- see: https://softwareengineering.stackexchange.com/questions/143302/what-are-the-names-for-various-forms-of-camel-case-style-naming
- see: https://medium.com/@jonyeezs/hey-typescript-wheres-my-i-prefixed-interface-cd70efa10bd1

## TODO
- exception handling / exception aggregation vs exceptioni masking (should be consistent in the whole system)

# Naming
- Naming must be constistant over the whole system.
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

# Error
- define Errors out of existance, when possible, so use try/catch
```

```

# Typings
```
// TODO classes
// - every Utility Class must implement an Interface

// TODO functions
// - every function must have a return type
```

# Comments
```
// TODO class

// TODO function

// TODO interface

// TODO variable

// TODO type
```
