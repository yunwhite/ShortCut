const nugu = require('./config.json')
const express = require('express')
const app = express()
app.use(express.json())

app.use('/shortcut/response', (req, res) => {
    const os = req.body.action.parameters['os'].value
    const program = req.body.action.parameters['program'].value
    const action = req.body.action.parameters['action'].value
    let output = nugu.response.output
    console.log(os, program, action)
    var ment = os + "의 " + program + " " + action + " 단축키는 "

    var mysql      = require('mysql');
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '비밀번호',
      database : 'pie'
    });

    connection.connect()

    var sql = 'SELECT short FROM shortcut WHERE os = ? AND program = ? AND action = ?;'
    var params = [os, program, action]
    var rowdata
    var shortdata
    let shortcut

    connection.query(sql, params, function(err, rows, fields) {
        if (err) {
            console.log(err)
            throw err
        } else {
            rowdata = JSON.stringify(rows)
            shortdata =  JSON.parse(rowdata)
            shortcut = shortdata[0].short
        }
    })

    output = {"prompt": ment + shortcut + " 입니다." }
    nugu.response.output = output
    return res.json(nugu.response)
})

app.listen(2025, (err, result) => {
    console.log("숏컷 서버 시작 : ", 2025)
})