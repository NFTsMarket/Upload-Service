//App routes  
module.exports = function(app){  
  
    var Person = require('../models/user');  
  
    //Create a new Person and save it  
    person = function(req, res){  
        var person = new Person({name: req.body.name, lastName: req.body.lastName});  
        person.save();  
        res.end();  
    };  
  
    //find all people  
    list = function(req, res){  
        Person.find(function(err, people) {  
            res.send(people);  
        });  
    };  
  
    //find person by id  
    find = (function(req, res) {  
        Person.findOne({_id: req.params.id}, function(error, person) {  
            res.send(person);  
        })  
    });  
  
    //Link routes and functions  
    app.post('/person', person);  
    app.get('/person', list);  
    app.get('/person/:id', find);  
}