module.exports = {
    ChRIStemplate:  function(jsonSource) {
        this.str_help   = `

        Object responsible for converting the input JSON to a ChRIS conformant
        collection template.
    
        `;
    
        this.json_source    = jsonSource;
        this.json_sink      = null;
        this.b_convert      = false;
        this.l_collection   = [];
        this.error          = null;
    }
}

module.exports.ChRIStemplate.prototype  = {
    constructor:    module.exports.ChRIStemplate,

    create:         function() {
        try {
            for(let [key, value] of Object.entries(this.json_source)) {
                this.l_collection.push({"name": key, "value": value})
            }
            this.json_sink  = {
                "template": { "data": this.l_collection }
            }
            this.b_convert  = true;
        }  catch(err) {
            this.b_convert  = false;
            this.error      = err;
        }
    }

}