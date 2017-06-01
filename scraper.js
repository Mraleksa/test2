var request = require('request');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();

function requestFunction(){
    request('http://www.landkreis-heilbronn.de/zulassung/kfz.json', function (error, response, html) {
        if (!error && response.statusCode == 200) {

            async.series([function (callback) {
                data = JSON.parse(html);
                callback();
            }], function (err) {
                statement.run(data[0].r030, data[0].txt, data[0].rate, data[0].exchangedate);
            });
        }
    });
}

var db = new sqlite3.Database('data.sqlite');
db.exec("CREATE TABLE IF NOT EXISTS KFZ(r030 INT, txt INT, rate INT, exchangedate DATE PRIMARY KEY)");
var data;
var statement = db.prepare("INSERT OR IGNORE INTO KFZ VALUES (?, ?, ?, ?)");
var run = setInterval(requestFunction,1000);
