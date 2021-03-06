#!/usr/bin/env node

const   str_aboutMe = `

NAME

    chripon 
    (ChRIS Pipeline JSON)

SYNOPSIS

    cat "someFile.json" | chripon [OPTION]
    chripon [OPTION]

DESC
    This simple nodejs program is a JSON converter, transforming a typically
    human generated JSON file describing a ChRIS pipeline into a collection
    JSON format suitable for POSTing to a ChRIS API endpoint.

    This utility is useful as a CLI tool for other scripts/programs that need
    to connect to a ChRIS API endpoint and which consume as input some JSON
    source file.

    For reference, a ChRIS pipeline typically contains some descriptive/meta
    information and a structure defining a tree of plugins, organized in a 
    directed acyclic graph (DAG). 

ARGS
    --man
    Show this man page. All other options, even if specified, are ignored.

    --verbose
    Be chatty!

    [--stdin] | [-i <inputFile>]
    Input specification. 
    If [--stdin] then input is read from a standard input stream.
    If [-i <inputFile>] then input is read from <inputFile>.
    If both specified, then [--stdin] only is used.

    [--stdout] | [-o <outputFile>] 
    Output specification.
    If [--stdout] then dump resultant JSON to standard output.
    If [-o <outputFile>] then save results to <outputFile>.
    If both specified, then [--stdin] only is used.
    
    [--stringify <JSONkey>]
    If passed, then additionally stringify the JSON key in the input
    specification.

    An input JSON can be something like:

    {
        "authors": "dev@fnndsc.org",
        "name": "covidnet-test",
        "description": "covidnet pipeline",
        "category": "mri",
        "locked": "true",
        "plugin_tree": [
          {
            "plugin_name": "pl-med2img",
            "plugin_version": "1.1.2",
            "previous_index": null,
            "plugin_parameter_default": [
              {
                "name": "inputFileSubStr",
                "default": "dcm"
              },
              {
                "name": "sliceToConvert",
                "default": "0"
              }
            ]
          },
          {
            "plugin_name": "pl-covidnet",
            "plugin_version": "0.2.4",
            "previous_index": 0,
            "plugin_parameter_default": [
              {
                "name": "imagefile",
                "default": "sample.png"
              }
            ]
          },
          {
            "plugin_name": "pl-covidnet-pdfgeneration",
            "plugin_version": "0.2.1",
            "previous_index": 1,
            "plugin_parameter_default": [
              {
                "name": "imagefile",
                "default": "sample.png"
              }
            ]
          }
        ]
    }

    which this program converts to (note the "plugin_tree" value has been 
    formatted to fit this box but should be a single lined string with 
    appropriate escaped quotes if POSTed to ChRIS):

    {
        "template": {
          "data": [
            {
              "name": "authors",
              "value": "dev@fnndsc.org"
            },
            {
              "name": "name",
              "value": "covidnet-test"
            },
            {
              "name": "description",
              "value": "covidnet pipeline"
            },
            {
              "name": "category",
              "value": "mri"
            },
            {
              "name": "locked",
              "value": "true"
            },
            {
              "name": "plugin_tree",
              "value": "[{\"plugin_name\":\"pl-med2img\",
                        \"plugin_version\":\"1.1.2\",
                        \"previous_index\":null,
                        \"plugin_parameter_default\":[{\"name\":\"inputFileSubStr\",
                        \"default\":\"dcm\"},
                        {\"name\":\"sliceToConvert\",\"default\":\"0\"}]},
                        {\"plugin_name\":\"pl-covidnet\",
                        \"plugin_version\":\"0.2.4\",
                        \"previous_index\":0,\"plugin_parameter_default\":
                        [{\"name\":\"imagefile\",\"default\":\"sample.png\"}]},
                        {\"plugin_name\":\"pl-covidnet-pdfgeneration\",
                        \"plugin_version\":\"0.2.1\",\"previous_index\":1,
                        \"plugin_parameter_default\":[{\"name\":\"imagefile\",
                        \"default\":\"sample.png\"}]}]"
            }
          ]
        }
      }
    
`;

const   yargs       = require("yargs");
const   program     = require("./app.js");

const   CLIoptions  = yargs
    .usage("Usage: [--verbose] [--stdin] | [-i <inputFile>] [--stdout] | [-o <outputFile>] [--stringify <JSONkey>]")
    .option(
        "v", {
            alias:          "verbose",
            describe:       "If specified, be chatty",
            type:           "boolean",
            default:        false
        })
    .option(
        "i", {
            alias:          "inputFile",
            describe:       "If specified, input file to read",
            type:           "string",
            default:        "",
            demandOption:   false    
        })
    .option(
        "f", {
            alias:          "stringify",
            describe:       "If specified, stringify the <JSONkey> in the input JSON structure",
            default:        "",
            type:           "string",
            demandOption:   false    
        })
    .option(
        "o", {
            alias:          "outputFile",
            describe:       "If specified, save to file (else write to stdout)",
            default:        "",
            type:           "string",
            demandOption:   false    
        })
    .option(
        "s", {
            alias:          "stdin",
            describe:       "If specified, read from stdin stream/pipe",
            type:           "boolean",
            default:        false
        })
    .option(
        "t", {
            alias:          "stdout",
            describe:       "If specified, stream output to stdout",
            type:           "boolean",
            default:        false
        })
    .option(
        "m", {
            alias:          "man",
            describe:       "If specified, show a man page",
            type:           "boolean",
            default:        false
        })
    .argv;

let APP             = new program.app(CLIoptions);
let b_runOK         = APP.run();

if(CLIoptions.verbose || CLIoptions.man || !b_runOK) {
    // This is probably overkill, but fun to play with some 
    // nodejs output generating options.

    APP.outputBox_setup();
    let str_info        = "";
    if(CLIoptions.man)
        str_info        = str_aboutMe;
    else if(!b_runOK && CLIoptions.verbose) {
        str_info        = APP.info_error();
    } else if(b_runOK && CLIoptions.verbose) {
        str_info        = APP.info_normal();
    }

    if(CLIoptions.verbose)
        APP.outputBox_print(str_info);

} 