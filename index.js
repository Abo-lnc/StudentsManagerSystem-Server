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
    }else if(req.url.startsWith('/tomanager') && req.method === 'GET'){
        console.log(req.url);
        var newUserData = querystring.parse(url.parse(req.url).query);
        var IsCorrectUser = UserCalibration(newUserData.Uid,newUserData.userPassword);
        console.log(IsCorrectUser);
        res.statusCode = 200;
        res.statusMessage = 'OK';
        if(IsCorrectUser){
            res.end(JSON.stringify(newUserData))
        }else{
            res.end()
        }

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
        delStuData(dellistdata.id);
        // console.log(studentsData.studentList);
        console.log('删除成功   id='+dellistdata.id);
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.end(JSON.stringify(studentsData.studentList));

    }else if(req.url.startsWith('/upstu') && req.method === 'GET'){

        var newUpdateData = querystring.parse(url.parse(req.url).query);
        if(UpdateStuData(newUpdateData.id,newUpdateData.name,newUpdateData.sex)){
            console.log('修改成功   id='+newUpdateData.id);
            res.statusCode = 200;
            res.statusMessage = 'OK';
            res.end(JSON.stringify(studentsData.studentList));
        }else{
            console.log('错误！');
            res.end();
        }

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

function UpdateStuData(id,name,sex) {
    // var num = studentsData.studentList.length;
    for (var i in studentsData.studentList){
        if(studentsData.studentList[i].id == id) {
            studentsData.studentList[i].name = name;
            studentsData.studentList[i].sex = sex;
            return true;
        }
    }

    return false;
}

function UserCalibration(Uid,userPassword) {
    for(var i = 0;i < userData.userData01.length;i++){
        if(userData.userData01[i].Uid == Uid && userData.userData01[i].userPassword == userPassword){
            return true;
        }else{
            return false;
        }
    }
}

