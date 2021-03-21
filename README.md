# hellocucumber
My Gherkin Work Shop 🥒

## Feel feel to clone and create your own work shop. 
* Remember to `npm i` those dependencies.

## I had two goals with this repo:

### 1. Successfully follow along with the tutorial at [Cucumber.io](https://cucumber.io/docs/guides/10-minute-tutorial/) for JavaScript.  
* It does! Run `npm test` to see the passing Gherkin scenarios

### 2. Successfully translate the .feature files into another file format. 
* I want to export the original feature files themselves, not the test results, so that I can use [Pandoc](https://pandoc.org/scripting-1.11.html) to create documentation for my BDD tests. 
* I found a glorious solution written by an awesome developer at this repo [https://github.com/melke/features2html](https://github.com/melke/features2html). In true open-source fashion, I've borrowed his code to play with.


* Running `npm start` will generate an HTML document from the .feature files contained within 
* Limitations: The current template does not recognize a gherkin table so that feature file is returned with ipsum text.

## As a developer, I want a simple solution for parsing my gherkin files into 

### What is BDD
* Discovery
* Formulation
* Automation