const http = require('http');
// const mysql = require('mysql');
var url = require('url');
var querystring = require('querystring');

// 暂时是个未完成的试验品

var studentsData = require('./src/studentsData');   //导入临时学生数据模块
var userData = require('./src/userData');   // 导入临时用户数据模块
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// app.use(bodyParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//设置跨域访问

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/getall',function (req, res) {
    res.send(JSON.stringify(studentsData.studentList));
});
app.get('/addstu',function (req, res) {
    // req.url = 'http://127.0.0.1:9091'+req.url;
    var newurl = url.parse(req.url);
    console.log(req.url);
    var newlistdata = querystring.parse(newurl.query);
    console.log(newlistdata.name);
    newlistdata.ctime = new Date();
    newlistdata.id = studentsData.studentList[studentsData.studentList.length -1].id + 1;
    studentsData.studentList.push(newlistdata);
    console.log('添加成功');
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.send(JSON.stringify(newlistdata));
});
app.get('/delstu',function (req, res) {
    console.log(req.url);
    var newUrl = url.parse(req.url);
    // console.log(newUrl);
    var dellistdata = querystring.parse(newUrl.query);
    console.log(dellistdata.id);
    delStuData(dellistdata.id);

    // console.log(studentsData.studentList);
    console.log('删除成功   id='+dellistdata.id);
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.send(JSON.stringify(studentsData.studentList));
});
app.post('/tomanager',function (req, res) {
    console.log(req.url);
    console.log(req.body);
    res.send();
})

app.listen(9091,() => {
    console.log('localhost:9091')
});

function delStuData(Dataid) {
    var num = studentsData.studentList.length;
    var sub = -1;
    for(var i = 0;i < num;i++) {
        if(studentsData.studentList[i].id == Dataid) {
            sub = i;
            break;
        }
    }
    studentsData.studentList.splice(sub,1);
}

// http.createServer(function (req,res) {
//
//     res.setHeader("Access-Control-Allow-Origin", "*");  // 跨域
//     // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     // res.setHeader('Access-Control-Allow-Methods', '*');
//
//     if(req.url === '/getall'){
//         res.end(JSON.stringify(studentsData.studentList));
//     }else if(req.url === '/tomanager' && req.method === 'post'){
//         var dataArray = '';
//         req.on('data', function (chunk) {
//             dataArray.push(chunk);
//         });
//         req.on('end', function (){
//             console.log(dataArray);
//
//             res.statusCode = 200;
//             res.statusMessage = 'OK';
//             res.end();
//         })
//
//     }else if(req.url.startsWith('/addstu') && req.method === 'GET'){
//
//
//
//     }else if(req.url.startsWith('/delstu') && req.method === 'GET'){
//
//     }else{
//         console.log(req.url);
//         res.writeHead(404,'Not Found',{
//             'Content-Type':'text/html;charset=utf-8'
//         });
//         res.write('404,page not found');
//     }
// }).listen(9091,function () {
//     console.log('localhost:9091');
// });



