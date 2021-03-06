var dateutil = require('../util/dateutil'),
    moment = require('moment'),
    Forecast = require('forecast.io');
var mongo = require('../models/mongo');



var mongodb = require('mongodb');
var db = new mongodb.Db('smartcity', new mongodb.Server(
    'ds045704.mongolab.com', 45704, {
        auto_reconnect : true
    }), {});




createUserEvents = function(req,res) {
    var db = mongo.getMongoConnection();

    db.open(function (err, db) {
        db.authenticate('username', 'password', function (err) {
            if (err) {
                throw err;
            } else {
                db.collection('user_events', function (err, collection) {

                    collection.insert(({
                        text:"My test event A",
                        start_date: new Date(2016,4,4),
                        end_date:   new Date(2016,4,4)
                    }), function (err, res) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('created event');
                        }
                        db.close();
                    });
                });
            }
        });
    });

}

getUserEvents = function(req,res) {
    var db = mongo.getMongoConnection();
    //console.log(customerImpacted);
    var userId = req.session.idperson;
    db.open(function (err, db) {
        db.authenticate('username', 'password', function (err, result) {
            var docs = "INTIAL DOCS";
            if (err) {
                throw err;
            } else {
                db.collection('user_events').find({ $where: "this.userId == "+userId } ).toArray(function(err, data){
                    //set id property for all records
                    console.log(data);
                    for (var i = 0; i < data.length; i++)
                        data[i].id = data[i]._id;
                       
                    res.send(data);
                });
              //  db.close();
            }
        });

    });

}

function inserEvent(data, userId) {
    console.log("Inside Insert Event");
    var db = mongo.getMongoConnection();

    db.open(function (err, db) {
        db.authenticate('username', 'password', function (err) {
            if (err) {
                throw err;
            } else {
                db.collection('user_events', function (err, collection) {
                    var d = Date.parse(data.start_date);
                    console.log("todays date"+d);
                    collection.insert(({
                        text: data.text,
                        start_date: data.start_date,
                        end_date: data.end_date,
                        userId : userId

                    }), function (err, res) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('inserted into user events');
                            db.close();
                        }
                        db.close();
                    });
                });
            }
        });
    });
}


addUserEvents = function(req,res) {
    var data = req.body;
    var mode = data["!nativeeditor_status"];
    var sid = data.id;
    var tid = sid;
    var userId = req.session.idperson;
    delete data.id;
    delete data.gr_id;
    delete data["!nativeeditor_status"];


    function update_response(err, result){
        if (err)
            mode = "error";
      /*  else if (mode == "inserted")
            tid = data._id;

        res.setHeader("Content-Type","text/xml");
        res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");*/
    }

    if (mode == "updated")
        db.user_events.updateById( sid, data, update_response);
    else if (mode == "inserted"){
        console.log("Mode is insterted");
        tid = data._id;

        res.setHeader("Content-Type","text/xml");
        res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
        inserEvent(data, userId);
        // db.user_events.insert(data, update_response);
        console.log("Inserted"+data);
       

    }
    else if (mode == "deleted")
    {
        var db = mongo.getMongoConnection();

        db.open(function (err, db) {
            db.authenticate('username', 'password', function (err) {
                if (err) {
                    throw err;
                } else {
                    console.log("To be removed is "+data.text);
                    db.collection('user_events').remove({ text : data.text});
                }
            });
        });
    }
    else
        res.send("Not supported operation");


};

exports.createUserEvents=createUserEvents;
exports.getUserEvents = getUserEvents;
exports.addUserEvents = addUserEvents;
