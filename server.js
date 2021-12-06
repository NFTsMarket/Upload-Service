var express = require('express');
var {StatusCodes} = require('http-status-codes');
var bodyParser = require('body-parser');
var Asset = require('./models/asset')

var BASE_API_PATH = "/api/v1";

var app = express();
app.use(bodyParser.json());

// CREAR ASSET
app.post(BASE_API_PATH + "/asset", async (req, res) => {
    console.log(Date() + " - POST /asset");

    try{
        if(typeof req.body.file !== 'string' || !req.body.file instanceof String){
            return res.status(StatusCodes.BAD_REQUEST).json("File must be a string.");
        }else if (req.body.file.match(/^ *$/) !== null){
            return res.status(StatusCodes.BAD_REQUEST).json("File can't be whitespace or empty.");
        }else if(typeof req.body.name !== 'string' || !req.body.name instanceof String){
            return res.status(StatusCodes.BAD_REQUEST).json("Name must be a string.");
        }else if (req.body.name.match(/^ *$/) !== null){
            return res.status(StatusCodes.BAD_REQUEST).json("Name can't be whitespace or empty.");
        }else if(typeof req.body.user !== 'string' || !req.body.user instanceof String){
            return res.status(StatusCodes.BAD_REQUEST).json("User must be a string.");
        }else if (req.body.user.match(/^ *$/) !== null){
            return res.status(StatusCodes.BAD_REQUEST).json("User can't be whitespace or empty.");
        }
        var asset = new Asset({ file: req.body.file, name: req.body.name, user: req.body.user });
        await asset.save();
        return res.status(StatusCodes.OK).json('Succesfully saved.');
    }catch(e){
        return res.status(StatusCodes.BAD_REQUEST).json(e.message);
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