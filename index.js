const http = require('http');
// const mysql = require('mysql');
var url = require('url');
var querystring = require('querystring');

var studentsData = require('./src/studentsData');   //导入临时学生数据模块
var userData = require('./src/userData');   // 导入临时用户数据模块

http.createServer(function (req,res) {

    res.setHeader("Access-Control-Allow-Origin", "*");  // 跨域

    if(req.url === '/getall'){
        res.end(JSON.stringify(studentsData.studentList));
    }else if(req.url.startsWith('/addstu') && req.method === 'GET'){

        req.url = 'http://127.0.0.1:9091'+req.url;
        var newurl = url.parse(req.url);
        var newlistdata = querystring.parse(newurl.query);
        console.log(newlistdata.name);
        newlistdata.ctime = new Date();
        newlistdata.id = studentsData.studentList[studentsData.studentList.length -1].id + 1;
        studentsData.studentList.push(newlistdata);
        console.log('写入成功');
        res.statusCode = 200;
        res.statusMessage = 'OK';
        // res.setHeader('Location', '/');
        res.end(JSON.stringify(newlistdata));

    }else if(req.url.startsWith('/delstu') && req.method === 'GET'){
        console.log(req.url);
        var newUrl = url.parse(req.url);
        // console.log(newUrl);
        var dellistdata = querystring.parse(newUrl.query);
        // console.log(dellistdata.id);
        delStuData(dellistdata.id);

        // console.log(studentsData.studentList);
        console.log('删除成功   id='+dellistdata.id);
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.end(JSON.stringify(studentsData.studentList));
    }else{
        console.log(req.url);
        res.writeHead(404,'Not Found',{
            'Content-Type':'text/html;charset=utf-8'
        });
        res.write('404,page not found');
    }
}).listen(9091,function () {
    console.log('localhost:9091');
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
