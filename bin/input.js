const   fs          = require("fs");

module.exports = {
    InputObj:   function(options) {
        this.str_help   = `

        Object responsible for input data collection. Two sources are possible:
    
            * named file (assumed to contain JSON and read as such)
            * pipe/stream from stdin
        
        Determination of which source is based on parsing the options structure.
    
        `;
    
        this.options    = options;
        this.str_data   = "";
        this.error      = null;
        this.ojson      = "";
        this.b_input    = false;
        this.b_json     = false;
    }
}

module.exports.InputObj.prototype  = {

    constuctor:     module.exports.InputObj,

    source:         function() {
        let inputSource = null;
        if(this.options.stdin)
            inputSource = process.stdin.fd;
        else
            inputSource = this.options.inputFile;

        try {
            this.str_data   = fs.readFileSync(inputSource, 'utf-8');
            this.b_input    = true;
        } catch (err) {
            this.b_input    = false;
            this.err        = err;
        }
    },

    parse:          function() {
        if(this.b_input) {
            try {
                this.ojson      = JSON.parse(this.str_data);
                this.b_json     = true;
            } catch(err) {
                this.error      = err;
                this.b_json     = false; 
            }
        }
        if(this.b_json && `${this.options.stringify}`) {
            if(this.ojson.hasOwnProperty(this.options.stringify)) {
                let key         = this.options.stringify;
                let str_val     = JSON.stringify(this.ojson[key]);
                this.ojson[key] = str_val;
            }
        }
    }
}
