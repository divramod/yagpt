# TODO
- This npm package basically is a task runner which offers a bunch of helper-
functions for tasks i have to do on a daily basis as a fullstack devop.
- This document collects abstract Information about how this package is designed.
- SYSTEM DESIGN NOTES
Basically, the package offers the following services:
1. It helps running complex tasks, in a structured way by offering a task
  class from which one can inherit and create own tasks and which offers some
  convinient functions for running tasks.
2. It also offers a lot of so called uitility-classes, which themself offer
  helper functions, which can be used programmatically.
3. It offers a so called project manager Utility, which helps me creating
   projects like websites, pwa's, api's, desktop-apps, native and hybrid
   mobile apps, npm packages and so on (this is a growing list)

# yagpt projects
Yagpt projects are the core part of the package. Implementing a yagpt project
helps avoiding writing redundant code, in the way, that implementing a project
of this type enforces a developer to reuse existing modules/tasks/utilities.

# yagpt project folder/file structure
Every yagpt project follows a convention on how the folder/file-structure of
the project has to look like:
  ```
  modules/
    moduleA/
      src/
      dist/
      package.json
      yagpt.config.json
    moduleB/
    moduleN/
  tasks/
    dist/
    src/
      taskContainerA/
        task1/
          index.spec.ts
          index.ts
        taskN/
      taskContainerB/
      taskContainerN/
  .gitignore
  .git/
  package.json
  yagpt.config.json
  ```

# TODO: yagpt modules

# yagpt product-templates
Yagpt provides a list of standard module-templates which can be used by
everyone in a yagpt project and whom are basically boilerplates for different
types of software-projects.
See [yagpt product-templates](productTemplates.md)

# yagpt tasks
As you know as a developer, there are different tasks a devop has to solve in
the lifecycle of a software-project. Many of these tasks can be automated and a
lot of them repeat in different kinds of software-projects. For beeing able to
reuse once automated tasks, the yagpt-npm-package provides a command line
interface and a programmatic interface. See [usage](usage)
The tasks one can run/solve with yagpt can be generally devided into 4
categories. These are:
- module tasks: Tasks, which can be applied to a specific yagpt-module.
- general project tasks: Task, which can be applied to every yagpt-project.
- project specific tasks: Tasks, which have been specifically created for a
  yagpt-project.
- global/system tasks: Tasks, which are not dependent on a yagpt-project.
To invoke the first 3 types of yagpt-tasks from the commandline, you need to be
in a yagpt-project-folder. A folder is considered to be a yagpt-project-folder
when it contains a file named yagpt.config.json.
See [yagpt config](yagpt-config) for the usage of this config file.

# TODO task classes
- extend the TaskUtility Class which offers helperfunctions for running a task
- are using the functions of Uitility Classes to solve multistep tasks
- are checking, if prerequisites for running as task are matched/fullfilled
- offer nice printouts of results from checking prerequistes and running tasks
- implement the TaskInterface
  - run(): have a run function, which runs the steps of the task
  - check(): have a check function, which checks, if all prerequisites for
    running the task are met

- tasks: consist of steps which have to be gone to solve a task
- steps: are preferably as granual as possible things which have to be done to 
         solve a task


# TODO: yagpt utilities
- utilities: collect functions, which represent steps of a task and can be
             combined in many different ways
## utility classes
- offer Helper functions for steps of tasks
- these functions are really basic and each can be viewed as a step of tasks
- can be of three types
  1. nodejs: offer helper functions for the daily usage of nodejs
  2. tools: offer helper functions for tools like npm, git, docker, etc
  3. yagpt: offer helper functions for the tools itself
