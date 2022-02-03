const   input       = require("./input.js");
const   output      = require("./output.js");
const   action      = require("./do.js");

const   colorize    = require("json-colorizer");
const   chalk       = require("chalk");
const   boxen       = require("boxen");

module.exports = {
    app:  function(options) {
        this.str_help   = `

        The "main" application object that contains/assembles
        the underlying modules.
    
        `;


        this.options        = options;
        this.IN             = new input.InputObj(options);
        this.DO             = null;
        this.OUT            = null;

        this.b_INok         = false;
        this.b_DOok         = false;
        this.b_OUTok        = false;

        this.boxOptions     = null;

        this.error          = null;
    }
}

module.exports.app.prototype  = {
    constructor:    module.exports.app,

    readJSON:               function() {
        this.IN.parse(
            this.IN.source()
        );
        this.b_INok         = this.IN.OK();
        if(!this.b_INok)
            this.error      = this.IN.error;
        return(this.IN.OK())
    },

    convertJSON:            function() {
        if(this.b_INok) {
            this.DO         = new action.ChRIStemplate(this.IN.ojson);
            this.b_DOok     = this.DO.convert();
            if(!this.b_DOok)
                this.error  = this.DO.error;
            return(this.DO.OK());
        }
        return this.b_DOok;
    },

    saveJSON:               function() {
        if(this.b_DOok) {
            this.OUT        = new output.OutputObj(this.options, this.DO);
            this.OUT.sink();
            this.b_OUTok    = this.OUT.OK();
            if(!this.b_OUTok)
                this.error  = this.OUT.error;
        }
        return(this.b_OUTok);
    },

    run:                    function() {
        this.saveJSON(
            this.convertJSON(
                this.readJSON()
            )
        )
        return this.OK();
    },

    OK:                     function() {
        return(this.b_INok && this.b_DOok && this.b_OUTok);
    },

    outputBox_setup:        function() {
        this.boxenOptions  = {
            padding:            1,
            margin:             0,
            borderStyle:        "round",
            borderColor:        "green",
            backgroundColor:    "#222222"
        };
    },

    info_error:             function() {
        str_info        = `
ERROR!

${this.error}
        `;
        return(str_info);
    },

    info_normal:            function() {
        const str_INcolor   = colorize(this.IN.str_data);
        const str_OUTcolor  = colorize(this.OUT.str_data);
        str_info        = `
Conversion summary

InputFile:      ${this.options.inputFile} 
InputSteam:     ${this.options.stdin}
OutputFile:     ${this.options.outputFile}
OutputStream:   ${this.options.stdout}

InputJSON:
${str_INcolor}
`;
        return(str_info);
    },

    outputBox_print:        function(str_info) {
        const str_boxText   = chalk.white.bold(str_info);
        const msgBox        = boxen(str_boxText, this.boxenOptions);
        console.log("\n");
        console.log(msgBox);
    }

}