# hellocucumber
My Gherkin Work Shop 🥒

## Feel feel to clone and create your own work shop. 
* Remember to `npm i` those dependencies.

## Goals for this repo:

### 1. Successfully follow along with the tutorial at [Cucumber.io](https://cucumber.io/docs/guides/10-minute-tutorial/) for JavaScript.  
* It does! Run `npm test` to see the passing Gherkin scenarios

### 2. Successfully translate the .feature files into another file format. 
* I want to export the original feature files themselves, not the test results, so that I can use [Pandoc](https://pandoc.org/scripting-1.11.html) to create documentation for my BDD tests. 
* I found a glorious solution written by an awesome developer at this repo [https://github.com/melke/features2html](https://github.com/melke/features2html). In true open-source fashion, I've borrowed his code to play with.


* Running `npm start` will generate an HTML document from the .feature files contained within 
* Limitations: The current template does not recognize a gherkin table so that feature file is returned with ipsum text.

3. I also wanted to play with [yargs](https://yargs.js.org/) vs [commander](https://www.npmjs.com/package/commander) for command line interactions. 
* Run `npm index.js --name Parrot` to see a fun hello!





### What is BDD
* Discovery
* Formulation
* Automation