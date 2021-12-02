var express = require('express');
var bodyParser = require('body-parser');
var Asset = require('./models/asset')

var BASE_API_PATH = "/api/v1";

var app = express();
app.use(bodyParser.json());

// CREAR ASSET
app.post(BASE_API_PATH + "/asset", (req, res) => {
    console.log(Date() + " - POST /asset");

    try{
        var asset = new Asset({ file: req.body.file, name: req.body.name, user: req.body.user });
        asset.save();
        return res.send('Succesfully saved.');
    }catch(e){
        return res.send(500, {error: err});
    }
});

// LISTAR ASSETS
app.get(BASE_API_PATH + "/asset", (req, res) => {
    console.log(Date() + " - GET /asset");

    Asset.find(function (err, asset) {
        if (err) return res.send(500, {error: err});
        return res.send(asset);
    });
});

// MODIFICAR ASSET
app.put(BASE_API_PATH + "/asset/:id", (req, res) => {
    console.log(Date() + " - UPDATE /asset");

    var filter = { _id: req.params.id };
        Asset.findOneAndUpdate(filter, req.body, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send('Succesfully saved.');
        });
});

// OBTENER UN ASSET
app.get(BASE_API_PATH + "/asset/:id", (req, res) => {
    console.log(Date() + " - GET /assets/:id");

    var filter = { _id: req.params.id };
    Asset.findOne(filter,function (err, asset) {
        if (err) return res.send(500, {error: err});
        return res.send(asset);
    });
});

// BORRAR ASSET
app.delete(BASE_API_PATH + "/asset/:id", (req, res) => {
    console.log(Date() + " - DELETE /assets/:id");

    Asset.findByIdAndDelete(req.params.id,function (err, asset) {
        if (err){
             return res.send(500, {error: err});
            }
        else if(asset){
            return res.send("Se ha eliminado el asset correctamente");
        }else{
            return res.send("No se encontró ningún asset con ese id");
        }
    });
});

module.exports = app;