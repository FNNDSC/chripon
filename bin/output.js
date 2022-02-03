const   fs          = require("fs");

module.exports = {
    OutputObj:      function(options, objTemplate) {
        this.str_help   = `

        Object responsible for output data creation. Two output sinks are possible:
    
            * named file (assumed to contain JSON and read as such)
            * stdout
        
        Determination of which source is based on parsing the input object structure
        
        `;
    
        this.options        = options;
        this.objTemplate    = objTemplate;
        this.error          = null;
        this.b_output       = false;
        this.str_data       = "";
    }
}

module.exports.OutputObj.prototype  = {

    constructor:    module.exports.OutputObj,

    sink:   function() {
        let outputSource = null;
        if(this.options.stdout)
            outputSource    = process.stdout.fd;
        else
            outputSource    = this.options.outputFile;
        try {
            this.str_data   = JSON.stringify(this.objTemplate.json_sink, null, 2);
            fs.writeFileSync(outputSource, JSON.stringify(this.objTemplate.json_sink))
            this.b_output   = true;
        } catch (err) {
            this.error      = err;
            this.b_output   = false
        }
    },

    OK:     function() {
        return(this.b_output);
    }
}