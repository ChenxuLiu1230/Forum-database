var express = require('express');
var bodyparse = require('body-parser');
var mysql = require('mysql2');
var cors = require("cors");

var conn = mysql.createConnection({
        host: "34.136.75.5",
        user:'root',
        password:'test1234',
        database:'forummodels'
});


conn.connect;

var app = express();

app.use(cors());
app.use(bodyparse.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res)=>{
        res.send("Hello friend")
});

app.post("/insert", (req, res)=>{
        const userID = req.body.userID;
        const name = req.body.name;
        const introduction = req.body.introduction;
        const password = req.body.password;
        const sqlInsert = "insert into `users` values (?, ?, ?, ?)";
        conn.query(sqlInsert, [userID, name, introduction, password], (err, result)=>{
                if(err) {
                        console.log(err);
                } else {
                        res.json(result);
                }
        })
});

app.get('/get', (req, res)=>{
        var sqlGet = "SELECT * FROM users";
        conn.query(sqlGet, function(error, results){
                if (error) {
                        res.send("error from the database side");
                }
                else {
                        res.json(results);
                }
        });
})

app.get('/get-comm', (req, res)=>{
        var sqlGet = "SELECT * FROM comments";
        conn.query(sqlGet, function(error, results) {
                if (error) {
                        res.send("error from the database side");
                } else {
                        res.json(results);
                }
        })
})


app.delete("/delete/:commentID", (req, res)=>{
        const id = req.params.commentID;
        var sqlDelete = "delete from `comments` where commentID = ?";
        conn.query(sqlDelete, id, (err, result)=>{
                if (err) {
                        console.log(err);
                } else {
                        res.json(result);
                }
        });
});


app.put("/update", (req, res)=>{
        const userID = req.body.userID;
        const password = req.body.password;
        const new_password = req.body.new_password;
        var sqlUpdate = "update `users` set password = ? where userID = ? and password = ?";
        conn.query(sqlUpdate, [new_password, userID, password], (error, result)=> {
                if (error) {
                        res.send("error from the database side: update");
                } else {
                        res.json(result)
                }
        });
});


app.get("/search/:userID", (req, res)=>{
        const userID = req.params.userID;
        var sqlSearch = "select * from `users` where userID = ?";
        conn.query(sqlSearch, userID, function(error, results){
                if (error) {
                        res.send("error from the databse side: search");
                }
                else {
                        res.json(results);
                };
        });
});


app.get("/maxVote", (req, res)=>{
        var maxVoteQuery = "select news.newsID, news.title, max(comments.vote) as max_vote from news join comments on (comments.newsID) = (news.newsID) group by news.newsID HAVING max_vote >= ALL (SELECT vote from comments) ORDER by max_vote DESC LIMIT 15";
        conn.query(maxVoteQuery, function(err, results){
                if (err) {
                        res.send("error from the database side: there is an error");
                } else {
                        res.json(results);
                }
        })
});


app.get("/capital", (req, res)=>{
        var capitalQuery = "(select users.name from users WHERE users.name like 'J%') union (select users.name from users join comments on users.userID = comments.userID WHERE comments.vote = 90) ORDER by name LIMIT 15";
        conn.query(capitalQuery, function(err, results){
                if (err) {
                        res.send("error from the database side: error from the database side: capital");
                } else {
                        res.json(results);
                }
        })
});

var http = require('http').Server(app);


var port = 80;

http.listen(port, function() {
        console.log('Listening to port 80');
})