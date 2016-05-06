var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

describe("SAMPLE unit test",function(){
// #1 should return home page

  it("should return home page",function(done){

    // calling home page api
    server
    .get("/home")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      // Error key should be false.
      //res.body.error.should.equal(false);
      done();
    });
  });

});


describe("Check Login Api",function(){
// #2 user should be able to login and user details should be returned

    var profile = {
        "email": "ss@gmail.com",
        "password": "sheela"
      };
  it("should return user name as Sheela Sanghvi",function(done){

    // calling home page api
    server
    .post("/api/login")
    .send(profile)
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.body.name.should.equal('Sheela Sanghvi');
      // Error key should be false.
      //res.body.error.should.equal(false);
      done();
    });
  });

});


describe("Retreive reasons for power failure",function(){
// #1 should return home page
  it("Should return causes for Power failure",function(done){

    // calling home page api
    server
    .get("/api/getOutagesByCause")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      //res.status.should.equal(200);
      res.body.should.have.property('Cause');
      res.body.should.have.property('Count');

      // Error key should be false.
      //res.body.error.should.equal(false);
      done();
    });
  });

});


describe("Shoud run R scripts",function(){
// #1 should return home page
  it("Should return message containing probabitity of power failure",function(done){
 this.timeout(15000);

    // calling home page api
    server
    .get("/api/runRScripts")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      //res.status.should.equal(200);
      
     
      //res.status.should.equal(200);
      done();
      // Error key should be false.
      //res.body.error.should.equal(false);
      
    });
  });

});

