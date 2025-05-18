# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-05-18 (by novan)
- Fixed bug in function getTemplates for calling isDirectory without ()
- Fixed bug in getDefaultTemplatesDir
- Changed createProjectFromTemplateCommand when there is no opened workingspace then create new Project
- Rebuild with newer version of nodejs, vscode

## [1.2.0] - 2018-12-09

- Resolve predefined variables in templates folder path (https://code.visualstudio.com/docs/editor/variables-reference)

## [1.1.1] - 2018-12-06
- Fixed bug of opening templates folder path that contains spaces

## [1.1.0] - 2018-12-06

- Changed default template location to be relative to `--user-data-dir` so will function properly in portable mode.  Installed versions of VSCode should be unaffected.

## [1.0.0] - 2018-11-23
- Initial release