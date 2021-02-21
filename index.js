// DEFAULT SETTINGS
const FILE_ENCODING = 'utf-8';
const INPUTDIR = 'examples/features';
const TEMPLATESDIR = 'default/templates';
const PRODUCTNAME = 'My Product Name';
const AUTHOR = 'John Doe';
const OUTPUTFILE = null;
const LANGUAGE = 'en';
const BREAKBEFOREWORD = null;
const DOCTEMPLATE, FEATURETEMPLATE;

// MODULES
const commander = require('commander'),
  fs = require('fs'),
  handlebars = require('handlebars'),
  linereader = require('line-reader'),
  underscore = require('underscore'),
  underscorestring = require('underscore.string'),
  async = require('async'),
  moment = require('moment'),
  path = require('path'),
  i18n = require('i18next');

// options
commander
  .version('0.1')
  .option('-i, --input-dir [path]', 'read feature files from path (default: examples/features)')
  .option('-t, --templates-dir [path]', 'read the files doc_template.html, feature_template.html and style.css from path (default: default/templates)')
  .option('-o, --output-file [path]', 'send output to file path (default: output_features2html/feature_YYYYMMDD_HHmm.html)')
  .option('-p, --product-name [string]', 'The name of your product used in headline and header (default: My Product Name)')
  .option('-a, --author [string]', 'The author name used in header (default: John Doe)')
  .option('-b, --break-before-word [string]', 'create a line break before every occurrance of this word in the background (default: null)')
  .option('-l, --lang [en|sv]', 'language used in feature files (default: en)');


// commands
commander
  .command('create')
  .description('Create html from feature files')
  .action(createCommand);

// Check if called without command
if (process.argv.length < 3) {
  commander.help();
}

// parse commands
commander.parse(process.argv);

function setup(done) {
  INPUTDIR = commander.inputDir || INPUTDIR;
  TEMPLATESDIR = commander.templatesDir || TEMPLATESDIR;
  OUTPUTFILE = commander.outputFile || OUTPUTFILE;
  LANGUAGE = commander.lang || LANGUAGE;
  AUTHOR = commander.author || AUTHOR;
  PRODUCTNAME = commander.productName || PRODUCTNAME;
  BREAKBEFOREWORD = commander.breakBeforeWord || BREAKBEFOREWORD;
  DOCTEMPLATE = TEMPLATESDIR + '/doc_template.html';
  FEATURETEMPLATE = TEMPLATESDIR + '/feature_template.html';
  i18n.init({ lng: LANGUAGE, resGetPath: path.dirname(require.main.filename) + '/locales/__lng__/__ns__.json'}, function(t) {
    done();
  });
}

function createCommand() {
  setup(create);
}

function create(){
  const docHandlebarTemplate = handlebars.compile(fs.readFileSync(DOCTEMPLATE, FILE_ENCODING));
  const featureHandlebarTemplate = handlebars.compile(fs.readFileSync(FEATURETEMPLATE, FILE_ENCODING));
  const cssStyles = fs.readFileSync(TEMPLATESDIR + '/style.css', FILE_ENCODING);

  parseFeatures(function(features) {

    const featuresHtml = '';
    if (features) {
      for (const i = 0; i < features.length; i++) {
        featuresHtml += featureHandlebarTemplate(features[i]);
      }
    }
    const docData = new Object();
    docData.cssStyles = cssStyles;
    docData.creationdate = moment().format('LL');
    docData.author = AUTHOR;
    docData.productname = PRODUCTNAME;
    docData.featuresHtml = featuresHtml;
    const docHtml = docHandlebarTemplate(docData);

    if (OUTPUTFILE) {
      writeOutput(docHtml, OUTPUTFILE);
    } else {
      // write to default output dir. Create first if necessary
      fs.mkdir('output',function(e){
        if(!e || (e && e.code === 'EEXIST')){
          const outputFilepath = 'output/features_' + moment().format('YYYYMMDD_HHmm') + '.html';
          writeOutput(docHtml, outputFilepath);
        } else {
          console.log(e);
        }
      });

    }


  });
}

function writeOutput(html, outputfile) {
  fs.writeFileSync(outputfile, html, FILE_ENCODING);
  console.log('DONE! HTML was written to %s', outputfile);

}

function parseFeatures(callback) {

  const allFiles = fs.readdirSync(INPUTDIR);
  const featureFiles = underscore.filter(allFiles, function(item) {
    return underscorestring.endsWith(item,'.feature');
  });
  const sortedFeatureFiles = featureFiles.sort();
  const sortedFeaturesFullpath = underscore.map(sortedFeatureFiles, function(filename) {
     return INPUTDIR + '/' + filename;
  });

  async.mapSeries(sortedFeaturesFullpath, parseFeatureFile, function(err, results) {
     callback(results);
  });
}

function parseFeatureFile(featureFilename, callback) {

  const feature = new Object();
  feature.background = '';
  feature.scenarios = [];
  const scenario = new Object();
  scenario.content = '';

  const foundMultirowScenario = false;
  const featureLineWasFound = false;
  const scenariosStarted = false;

  linereader.eachLine(featureFilename, function(line) {

    if (lineIndicatesThatANewScenarioBegins(line) && foundMultirowScenario) {
      // new scenario found. start parsing new scenario
      feature.scenarios.push(scenario);
      scenario = new Object();
      scenario.content = '';
      foundMultirowScenario = false;
      scenariosStarted = true;
    }

    if (lineIndicatesThatANewScenarioBegins(line) || foundMultirowScenario) {
      // We are parsing a scenario. It may be a new scenario or a row within a scenario
      foundMultirowScenario = true;
      scenariosStarted = true;

      // Handle sidenote
      if (i18nStringContains(line, 'sidenote')) {
         scenario.sidenote = line.replace(i18n.t('sidenote'), '');
      } else {
        // Handle scenario content
        if (scenario.content) {
          scenario.content = scenario.content + '\n' + line;
        } else {
          scenario.content = line;
        }
      }

    }

    if (!i18nStringContains(line, 'feature') && !scenariosStarted && featureLineWasFound) {
       // Everything between feature and first scenario goes into feature.background, except background keyword
       const fixedline = BREAKBEFOREWORD ? line.replace(BREAKBEFOREWORD, '</p><p class="p-after-p">' + BREAKBEFOREWORD) : line;
       fixedline = fixedline + '<br/>';
       feature.background = feature.background + ' ' + fixedline.replace(i18n.t('background'), '');
    }

    if (i18nStringContains(line, 'feature')) {
      feature.name = line.replace(i18n.t('feature'), '');
      featureLineWasFound = true;
    }

  }).then(function () {
      // Add last scenario, if exists
      if (scenario && scenario.content) {
        feature.scenarios.push(scenario);
      }
      callback(null, feature);
  });

}

function lineIndicatesThatANewScenarioBegins(line) {
  return i18nStringContains(line, 'scenario') || i18nStringContains(line, 'scenario_outline') || i18nStringContains(line, 'sidenote') || i18nStringContains(line, 'background');
}

function i18nStringContains(orgstring, i18nkey) {
  return  orgstring.indexOf(i18n.t(i18nkey)) !== -1;
}

