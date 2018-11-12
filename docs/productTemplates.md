# yagpt standard module-templates
[List of Templates](https://docs.google.com/spreadsheets/d/13iqYdZzM6ByU90II76yXo-6sC_7eDvqkCsVWuaezuls/edit#gid=236997459)

The name of a module-template is constructed as:
PRODUCT-LANGUAGE-FRAMEWORK-SCOPE
- PRODUCT: the target platform/type of product
  - server: a product, which runs on a server
  - database: a database
  - mobile: a mobile app
  - website: a website
  - desktop: a desktop application
  - npm: a npm package
  - git: a repository
  - pwa: a progressive web app
- LANGUAGE: the language to use
  - ts: typescript
  - js: javascript
  - py: python
  - ...
- FRAMEWORK (Optional): The framework/library which is used. Examples:
  - reactjs: For example on website, electron-desktop-app
  - electron:  A desktop application development framework.
  - ...
- SCOPE: How complex the setup is.
  - basic: without any additional dependencies
  - auth: authentication implemented
  - ...
You are also able to create own templates, for project-types you repeatedly use.
