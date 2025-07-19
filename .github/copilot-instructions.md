# Codacy Rules
Configuration for AI behavior when interacting with Codacy's MCP Server

## using any tool that accepts the arguments: `provider`, `organization`, or `repository`
 - provider: gh
 - organization: chisgit
 - repository: MenuBosse

## After ANY successful `edit_file` or `reapply` operation
 - `rootPath`: set to the workspace path
 - `file`: set to the path of the edited file
 - `tool`: leave empty or unset

## CRITICAL: Dependencies and Security Checks
 - Running npm/yarn/pnpm install
 - Adding dependencies to package.json
 - Adding requirements to requirements.txt
 - Adding dependencies to pom.xml
 - Adding dependencies to build.gradle
 - Any other package manager operations
 - `rootPath`: set to the workspace path
 - `tool`: set to "trivy"
 - `file`: leave empty or unset
 - Stop all other operations
 - Propose and apply fixes for the security issues
 - Only continue with the original task after security issues are resolved
 - After: npm install react-markdown
 - Do: Run codacy_cli_analyze with trivy
 - Before: Continuing with any other tasks

## General

## Whenever a call to a Codacy tool that uses `repository` or `organization` as a parameter returns a 404 error

# Generic Project Rules (from custom_instructions.md)
ALWAYS USE POWERSHELL FOR WINDOWS Sytax for all commands no &
Do NOT REMOVE any previous debug statements
Only make a small set of changes at a time, following best practices to ensure we can test each change.
I prefere one word or short answers, If require more clarifiations I will ask explicitly.
First propose the change.  If you can test the change move forward to testing the change.  
IF there are errors, debug the error and fix it.  Then retest
DO NOT EVER remove debug statements unless explicitly asked to do so.
DO NOT EVER remove existing functionality unless explicitly asked to do so.
DO NOT EVER randomly remove code or comments because you think you're cool
DO NOT EVER introduce any breaking changes EVER EVER
Write Unit tests as part of your BEST CODING PRACTICE so you know what's working and what isn't without having to ask me like an idiot
ALWAYS UPDATE the plan when you complete and tests have passed by ME
THERE ARE OTHER AI AGENTS working with you, keep changes modular and decoupled so they can be reused by other agents