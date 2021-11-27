//App routes  
module.exports = function (app) {

    var User = require('../models/user');
    var Asset = require('../models/asset')


    // ======================== USER ===========================
    //Create a new User and save it  
    createUser = function (req, res) {
        var user = new User({ name: req.body.name, lastName: req.body.lastName });
        user.save();
        res.end();
    };

    //find all people  
    listUsers = function (req, res) {
        User.find(function (err, people) {
            res.send(people);
        });
    };

    //find user by id  
    findUser = (function (req, res) {
        User.findOne({ _id: req.params.id }, function (error, user) {
            res.send(user);
        })
    });

    // ======================== ASSET ===========================

    //Create a new Asset and save it  
    createAsset = function (req, res) {
        var asset = new Asset({ file: req.body.file, name: req.body.name, user: req.body.user });
        asset.save();
        res.end();
    };

    //find all assets  
    listAssets = function (req, res) {
        Asset.find(function (err, asset) {
            res.send(asset);
        });
    };

    updateAsset= function(req, res){
        var filter = { _id: req.params.id };
        Asset.findOneAndUpdate(filter, req.body, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send('Succesfully saved.');
        });
    }

    findAsset= function(req, res){
        var filter = { _id: req.params.id };
        Asset.findOne(filter,function (err, asset) {
            if (err) return res.send(500, {error: err});
            res.send(asset);
        });
    }
    
    deleteAsset= function(req, res){
        Asset.findByIdAndDelete(req.params.id,function (err, asset) {
            if (err){
                 return res.send(500, {error: err});
                }
            else if(asset){
                res.send("Se ha eliminado el asset correctamente");
            }else{
                res.send("No se encontró ningún asset con ese id");
            }
        });
    }
    
    //Link routes and functions  
    app.post('/user', createUser);
    app.get('/user', listUsers);
    app.get('/user/:id', findUser);

    app.post('/asset', createAsset);
    app.get('/assets', listAssets);
    app.put('/asset/:id', updateAsset);
    app.get('/assets/:id', findAsset);
    app.delete('/assets/:id', deleteAsset);
}