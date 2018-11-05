# SYSTEM DESIGN NOTES
This npm package basically is a task runner which offers a bunch of helper-
functions for tasks i have to do on a daily basis as a fullstack devop.

This document collects abstract Information about how this package is designed.

Basically, the package offers the following services:
1. It helps running complex tasks, in a structured way by offering a task
  class from which one can inherit and create own tasks and which offers some
  convinient functions for running tasks.
2. It also offers a lot of so called uitility-classes, which themself offer
  helper functions, which can be used programmatically.
3. It offers a so called project manager Utility, which helps me creating
   projects like websites, pwa's, api's, desktop-apps, native and hybrid
   mobile apps, npm packages and so on (this is a growing list)

On an abstract level you can see it the following way:
- tasks: consist of steps which have to be gone to solve a task
- steps: are preferably as granual as possible things which have to be done to 
         solve a task
- utilities: collect functions, which represent steps of a task and can be
             combined in many different ways

# utility classes
- offer Helper functions for steps of tasks
- these functions are really basic and each can be viewed as a step of tasks
- can be of three types
  1. nodejs: offer helper functions for the daily usage of nodejs
  2. tools: offer helper functions for tools like npm, git, docker, etc
  3. yagpt: offer helper functions for the tools itself

# task classes
- extend the TaskUtility Class which offers helperfunctions for running a task
- are using the functions of Uitility Classes to solve multistep tasks
- are checking, if prerequisites for running as task are matched/fullfilled
- offer nice printouts of results from checking prerequistes and running tasks
- implement the TaskInterface
  - run(): have a run function, which runs the steps of the task
  - check(): have a check function, which checks, if all prerequisites for
    running the task are met

# 
