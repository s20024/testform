import React from 'react';
import './App.css';
import Select from 'react-select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

class ViewItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            lang: "",
            stmt: "",
            words: [],
            code: "",
            sample: "",
            result: "",
            tags: [],
        };
    };

    componentDidMount() {
        this.loadWords();
    };

    componentDidUpdate() {
        const pLang = this.props.lang
        const pStmt = this.props.stmt
        if ((this.state.lang !== pLang) || (this.state.stmt !== pStmt)) {
            if (Object.keys(this.props.data).length === 0) {return}
            const cellData = this.props.data[pLang].statement[pStmt]
            if (cellData === undefined ) {return}
            const tags = []
            cellData.tag.forEach(i => {
                tags.push({value: i, label: i})
            })
            this.setState({
                lang: pLang,
                stmt: pStmt,
                code: cellData.code,
                sample: cellData.sample,
                result: cellData.result,
                tags: tags
            })
        };
        if (this.state.data !== this.props.data) {
            this.setState({data: this.props.data})
        };
    };

    loadWords() {
        const words = [
            "python", "python3", "py",
            "java", "ja", 
            "javascript", "js",
            "kotlin", "kt",
            "swift",

            "loop", "for", "while", "break", "continue",
            "if", "elif", "else",
            "in", "not", "and", "or",
            "try", "catch", "except", "error",
            "when", "case", "switch", "then",
            "comment", "out",
            "with", "open",

            "class",
            "def", "function", "func",
            "const", "let", "var", "val",
            "global", "local",

            "import", "from", "require",
            
            "list", "array", "mutable",
            "dict", "dictionary",
            "object", "obj",
            "set",
            "map",
            "tuple",
            "range",

            "chr", "character",
            "str", "string",
            "int", "integer",
            "long", "float", "double",
            "bool", "boolean", "true", "false",
            "date", "time",
            
            "console", "log", "print", "printf", "println", "reader", "read", "readline",
            "input", "stream",
            "join",
            "pow", "power", "minus", "plus",
            "round",
            "add", "append", "push", "concat", "unshift", "shift", 
            "delete", "pop", "remove", "removeAt",
            "slice", "filter", "reduce", "some", "every", "flat", "flatMap",
            "splice", "find", "findindex", "includes", "lastindex",
            "keys", "fill", "zfill", "round", 
            "enumerate", "isnull", "forEach", "isnumeric",
            "random", "randint", "ran",
            "len", "length", "size",
            "reverse", "reversed",
            "sort", "sorted",
            "shuffle", "shuffled",
            "format", "f",
            "replace", 
            "type",

            "event", "mouse", "value", "key", "document", "window",
            "listener", "context", "position", "index", "url", "uri",
            "get", "set", "item", "file", "write", "read", "os", 
            "system", "request", "response", "beautifulsoup", "soup", 
            "subprocess",
            
            "echo", "cat", "do", "done", "sleep", 

        ]
        const options = []
        words.forEach(i => {
            options.push({value: i, label: i})
        })
        this.setState({words: options});
    };

    handleTagsChange(e) {
        const tags = []
        e.forEach(item => {
            tags.push({value:item.value, label: item.value});
        });
        this.setState({tags: tags});
    };

    handleCodeChange(code) {
        this.setState({code: code.target.value});
    };

    handleSampleChange(sample) {
        this.setState({sample: sample.target.value});
    };
    
    handleResultChange(result) {
        this.setState({result: result.target.value});
    };

    handleSave() {
        const data = this.state.data
        data[this.state.lang].statement[this.state.stmt].code = this.state.code
        data[this.state.lang].statement[this.state.stmt].result = this.state.result
        data[this.state.lang].statement[this.state.stmt].sample = this.state.sample
        const tags = []
        this.state.tags.forEach(i => {
            tags.push(i.value)
        })
        data[this.state.lang].statement[this.state.stmt].tag = tags
        this.props.unnko(data)
    }

    render() {
        return (
            <div id="view_items">
                <div className="item_title">
                    <h2>{`${this.state.lang} -> ${this.state.stmt}`}</h2>
                </div>
                <div className="input_text">
                    <h3>code:</h3>
                    <TextField
                        className="text_field"
                        id="input_code"
                        label="Code"
                        multiline
                        maxRows={6}
                        value={this.state.code}
                        onChange={this.handleCodeChange.bind(this)}
                        variant="filled"
                    />
                </div>
                <div className="input_text">
                    <h3>sample:</h3>
                    <TextField
                        className="text_field"
                        id="input_samples"
                        label="Sample"
                        multiline
                        maxRows={6}
                        value={this.state.sample}
                        onChange={this.handleSampleChange.bind(this)}
                        variant="filled"
                    />
                </div>
                <div className="input_text">
                    <h3>result:</h3>
                    <TextField
                        className="text_field"
                        id="input_result"
                        label="Result"
                        multiline
                        maxRows={6}
                        value={this.state.result}
                        onChange={this.handleResultChange.bind(this)}
                        variant="filled"
                    />
                </div>
                <div className="input_select">
                    <h3>tags:</h3>
                    <Select
                        id="input_tags"
                        defaultValue={null}
                        isMulti
                        name="tags"
                        value={this.state.tags}
                        options={this.state.words}
                        onChange={this.handleTagsChange.bind(this)}
                        classNamePrefix="select"
                    />
                </div>
                    <Button 
                        variant="contained" 
                        className="save_button" 
                        onClick={() => {this.props.unnko(this.state.lang, this.state.stmt, this.state.code, this.state.sample, this.state.result, this.state.tags)}}>
                        Save
                        </Button>
                <div>
                </div>
            </div>
        );
    };
};

export default ViewItems;
