import React from 'react';
import './App.css';
import ViewItems from './ViewItems'
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useCookies } from 'react-cookie';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            selectLang: "python",
            selectStmt: "for",
            newLang: "",
            newStmt: "",
            password: "",
            comment: "",
            deleteLang: "",
            deleteStmt: "",
            open: ""
        };
    };

    componentDidMount() {
        this.loadAllData('http://133.242.158.143:8100/getdata')
    };

    async loadAllData(url) {
        return fetch(url)
            .then((res) => res.json())
            .then((res) => this.setState({data: res}))
    };

    async postData(data, key, comment) {
        const url = `http://133.242.158.143:8100/postdata?key=${key}&comment=${comment}`
        const requestOptions ={
            method: "POST",
            headers: {"Content-Type": "text/plain"},
            body: JSON.stringify(data)
        }
        return fetch(url, requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.status === "true") {
                    alert("OK")
                } else {
                    alert("key is not true")
                }
            })
    }

    handleClickLangs(lang) {
        const selectStmt = Object.keys(this.state.data[lang].statement)[0]
        this.setState({
            selectStmt: selectStmt,
            selectLang: lang,
        });
    };

    handleClickStmts(stmt) {
        this.setState({selectStmt: stmt});
    };

    handleChangeItems(data) {
        this.setState({data: data})
    };

    handleChangeNewLang(data) {
        this.setState({newLang: data.target.value})
    };

    handleChangePassword(e) {
        this.setState({password: e.target.value})
    }

    handleChangeComment(e) {
        this.setState({comment: e.target.value})
    };

    handleClickNewLang() {
        const data = this.state.data
        if (this.state.newLang === "") {
            return
        }
        else if (this.state.newLang in data){
            return
        }
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth()+1
        const day = today.getDate()

        data[this.state.newLang] = {
            id: Object.keys(data).length,
            statement: {},
            update: `${year}-${month}-${day}`
        }
        this.setState({
            data: data,
            newLang: ""
        })
    };


    handleChangeNewStmt(data) {
        this.setState({newStmt: data.target.value})
    };
    
    handleClickNewStmt() {
        const data = this.state.data
        if (this.state.newStmt === "") {return}
        else if (this.state.newStmt in data[this.state.selectLang].statement) {return}
        data[this.state.selectLang].statement[this.state.newStmt] = {
            code: "",
            sample: "",
            result: "",
            tag: []
        }
        this.setState({data: data, newStmt: ""})
    };

    handleClickSave(lang, stmt, code, sample, result, tag) {
        const data = this.state.data
        data[lang].statement[stmt].code = code
        data[lang].statement[stmt].result = result
        data[lang].statement[stmt].sample = sample
        const tags = []
        tag.forEach(i => {
            tags.push(i.value)
        })
        data[lang].statement[stmt].tag = tags
        this.setState({data: data})
    };

    handleChangeDeleteLang(e) {
        this.setState({deleteLang: e.target.value})
    }

    handleChangeDeleteStmt(e) {
        this.setState({deleteStmt: e.target.value})
    }

    handleOpen() {
        this.setState({open: true})
    }

    handleClose() {
        this.setState({open: false})
    }

    handleDelete(lang, stmt) {
        const data = this.state.data
        if (lang === "") {
            alert("delete langが設定されていません。")
        }
        else if (!(lang in data)) {
            alert(`${lang}という言語はありません。`)
            return
        } 
        else if (stmt === "") {
            delete data[lang]
            this.setState({data: data})
            alert(`${lang}を削除しました。`)
        }
        else if (!(stmt in data[lang].statement)) {
            alert(`${stmt}というステートメントは${lang}にありません。`)
        }
        else {
            delete data[lang].statement[stmt]
            this.setState({data: data})
            alert(`${lang}-${stmt}を削除しました。`)
        }

    }

    render() {
        return (
            <div id="content">
                <div id="content_header">
                    <h2 id="title" className="title_view">データ入力フォーム</h2>
                        <Button 
                            variant="contained" 
                            className="save_button" 
                            onClick={() => {
                                this.postData(encodeURI(JSON.stringify(this.state.data, null, "\t")), this.state.password, this.state.comment)
                            }}>
                            send data
                        </Button>
                        <TextField
                            className="save_button"
                            id="password_code"
                            label="password"
                            type="password"
                            variant="filled"
                            value={this.state.password}
                            onChange={this.handleChangePassword.bind(this)} />
                        <TextField
                            className="save_button"
                            id="comment_code"
                            label="commit comment"
                            variant="filled"
                            value={this.state.comment}
                            onChange={this.handleChangeComment.bind(this)} />
                </div>
                <div id="content_body">
                    <div className="content_body_item" id="langs">
                        <h2>langs</h2>
                        <TextField
                            className="new_text"
                            id="input_code"
                            label="new lang"
                            variant="filled"
                            value={this.state.newLang}
                            onChange={this.handleChangeNewLang.bind(this)}
                        />
                        <IconButton aria-label="add" size="large" onClick={this.handleClickNewLang.bind(this)}>
                            <AddIcon fontSize="inherit" className="add_Icon"/>
                        </IconButton>
                        <ViewLangs data={this.state.data} onClick={this.handleClickLangs.bind(this)} selectLang={this.state.selectLang}/>
                    </div>
                    <div className="content_body_item" id="stmts">
                        <h2>stmt</h2>
                        <TextField
                            className="new_text"
                            id="input_code"
                            label="new stmt"
                            variant="filled"
                            value={this.state.newStmt}
                            onChange={this.handleChangeNewStmt.bind(this)}
                        />
                        <IconButton aria-label="add" size="large" onClick={this.handleClickNewStmt.bind(this)}>
                            <AddIcon fontSize="inherit" className="add_Icon"/>
                        </IconButton>
                        <ViewStmts data={this.state.data} lang={this.state.selectLang} onClick={this.handleClickStmts.bind(this)} selectStmt={this.state.selectStmt} />
                    </div>
                    <div className="content_body_item" id="items">
                        <ViewItems data={this.state.data} lang={this.state.selectLang} stmt={this.state.selectStmt} unnko={this.handleClickSave.bind(this)}/>
                    </div>
                </div>
                <div id="content_footer">
                    <Button 
                        variant="contained" 
                        className="save_button" 
                        color="error"
                        onClick={() => {
                            this.handleOpen.bind(this)()
                        }}>
                        delete
                    </Button>
                        <Dialog
                            open={this.state.open}
                            onClose={this.handleClose.bind(this)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {`${this.state.deleteLang}-${this.state.deleteStmt}を削除してよろしいですか？`}
                            </DialogTitle>
                            <DialogContent>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.handleClose.bind(this)()
                                alert("キャンセルしました。")
                            }}>
                                cancel
                            </Button>
                            <Button onClick={() => {
                                this.handleClose.bind(this)()
                                this.handleDelete.bind(this)(this.state.deleteLang, this.state.deleteStmt)
                            }} autoFocus>
                                delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <TextField
                        className="save_button"
                        id="delete_stmt"
                        label="delete stmt"
                        variant="filled"
                        value={this.state.deleteStmt}
                        onChange={this.handleChangeDeleteStmt.bind(this)} />
                    <TextField
                        className="save_button"
                        id="delete_lang"
                        label="delete lang"
                        variant="filled"
                        value={this.state.deleteLang}
                        onChange={this.handleChangeDeleteLang.bind(this)} />
                </div>
            </div>
        );
    };
};

const ViewLangs = (props) => {
    if (Object.keys(props.data).length === 0) {
        return <div></div>
    };
    return Object.keys(props.data).map(lang => {
        if (lang === props.selectLang) {
            return (
                <div onClick={() => {props.onClick(lang)}} style={{backgroundColor: "blue"}} className="select">
                    <h3>{lang}</h3>
                </div> 
            );
        }
        return (
            <div onClick={() => {props.onClick(lang)}} className="select">
                <h3>{lang}</h3>
            </div> 
        );
    });
};

const ViewStmts = (props) => {
    if (Object.keys(props.data).length === 0) {
        return <div></div>
    };
    return Object.keys(props.data[props.lang].statement).map(stmt => {
        if (stmt === props.selectStmt) {
            return (
                <div onClick={() => {props.onClick(stmt)}} className="select" style={{backgroundColor: "blue"}} >
                    <h3>{stmt}</h3>
                </div>
            )
        }
        return (
            <div onClick={() => {props.onClick(stmt)}} className="select">
                <h3>{stmt}</h3>
            </div>
        );
    });
};

export default App
