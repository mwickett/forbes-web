# Forbes and Associates Web

Website for Forbes and Associates Psychology Practice.

## Style Conventions

This project (mostly) follows the [GPS approach](https://github.com/jescalan/gps). This means each page is scoped using an id on the `<main>` element.

Additionally, the following class naming conventions are used:

* `.g-<name>` for global style classes used across the site
* `.p-<name>` for page level style classes used on a single page
* `.s-<name>` for section level style classes. These are mostly used on the home page (for example)

## Setup

- make sure [node.js](http://nodejs.org) is at version >= `6`
- `npm i spike -g`
- clone this repo down and `cd` into the folder
- run `npm install`
- run `spike watch` or `spike compile`

## Testing
Tests are located in `test/**` and are powered by [ava](https://github.com/sindresorhus/ava)
- `npm install` to ensure devDeps are installed
- `npm test` to run test suite
