var express = require('express');
var {StatusCodes} = require('http-status-codes');
var ObjectId = require('mongoose').Types.ObjectId;
var bodyParser = require('body-parser');
var Asset = require('./models/asset')
const googlePhotos= require('./googlePhotos/googlePhotosService')
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
        // }else if(req.body.file.match(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/) === null){
        //     return res.status(StatusCodes.BAD_REQUEST).json("The URL is not valid");
        }else if(typeof req.body.name !== 'string' || !req.body.name instanceof String){
            return res.status(StatusCodes.BAD_REQUEST).json("Name must be a string.");
        }else if (req.body.name.match(/^ *$/) !== null){
            return res.status(StatusCodes.BAD_REQUEST).json("Name can't be whitespace or empty.");
        }else if(typeof req.body.user !== 'string' || !req.body.user instanceof String){
            return res.status(StatusCodes.BAD_REQUEST).json("User must be a string.");
        }else if (req.body.user.match(/^ *$/) !== null){
            return res.status(StatusCodes.BAD_REQUEST).json("User can't be whitespace or empty.");
        }
        var token=await googlePhotos.get_access_token_using_saved_refresh_token();
        var googlePhotosResponse= await googlePhotos.createAsset(token,req.body);
        var asset = new Asset({ 
            file: googlePhotosResponse.newMediaItemResults[0].mediaItem.id, 
            name: req.body.name, 
            user: req.body.user });
        await asset.save();
        res.setHeader('Location', '/asset/'+asset._id);
        return res.status(StatusCodes.CREATED).json(asset);
    }catch(e){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
    }
});

// LISTAR ASSETS
app.get(BASE_API_PATH + "/asset", (req, res) => {
    console.log(Date() + " - GET /asset");
    let limitatt = (req.query["limit"] != null && !Number.isNaN(req.query["limit"]) ) ? req.query["limit"] : 0;
    let offset = (req.query["offset"] != null && !Number.isNaN(req.query["offset"]) ) ? req.query["offset"] : 0;
    let sortatt = (req.query["sort"] != null) ? req.query["sort"] : null;
    let order = (req.query["order"] != null) ? req.query["order"] : 1;

    let filters = req.query;
    Object.keys(filters).forEach(x => {
        if (x == "sort" || x == "order" || x == "limit" || x == "offset") {
            delete filters[x];
        }
    });
    Asset.find(filters, null, { sort: { [sortatt]: order, _id: 1 }, limit: limitatt, skip: offset*limitatt }, async function (err, assets) {
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        var token=await googlePhotos.get_access_token_using_saved_refresh_token();
        var googlePhotosResponse= await googlePhotos.listAssets(token);

        for(asset in assets){
            var googlePhotoInfo=googlePhotosResponse.find(x=> assets[asset].file==x.id); 
            assets[asset]._doc["image"]=googlePhotoInfo;
        }

        return res.status(StatusCodes.OK).json(assets);
    });
});

// MODIFICAR ASSET
app.put(BASE_API_PATH + "/asset/:id", async (req, res) => {
    console.log(Date() + " - UPDATE /asset");
    try{
        if(!ObjectId.isValid(req.params.id)){
            return res.status(StatusCodes.NOT_FOUND).json("An asset with that id could not be found, since it's not a valid id.");
        }
        if (req.body.file!==undefined){
            if(req.body.file.match(/^ *$/) !== null){
                return res.status(StatusCodes.BAD_REQUEST).json("File can't be whitespace or empty.");
            }
            if(req.body.file.match(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/) === null){
                return res.status(StatusCodes.BAD_REQUEST).json("The URL is not valid");
            }
            if(typeof req.body.file !== 'string' || !req.body.file instanceof String){
                return res.status(StatusCodes.BAD_REQUEST).json("File must be a string.");
            }
        }
        if(req.body.name!==undefined){
            if(req.body.name!==null & typeof req.body.name !== 'string' || !req.body.name instanceof String){
                return res.status(StatusCodes.BAD_REQUEST).json("Name must be a string.");
            }
            if(req.body.name.match(/^ *$/) !== null){
                return res.status(StatusCodes.BAD_REQUEST).json("Name can't be whitespace or empty.");
            }
        }
        if(req.body.user!==undefined){
            if(typeof req.body.user !== 'string' || !req.body.user instanceof String){
                return res.status(StatusCodes.BAD_REQUEST).json("User must be a string.");
            }
            if(req.body.user.match(/^ *$/) !== null){
                return res.status(StatusCodes.BAD_REQUEST).json("User can't be whitespace or empty.");
            }
        }

        var filter = { _id: req.params.id };
        Asset.findOneAndUpdate(filter, req.body, function(err, doc) {
            if(!doc){
                return res.status(StatusCodes.NOT_FOUND).json("An asset with that id could not be found.");
            }
        });
        var asset = await Asset.findOne(filter);
        if(asset){
            return res.status(StatusCodes.OK).json(asset);
        }else{
            return res.status(StatusCodes.NOT_FOUND).json("An asset with that id could not be found.");
        }
    }catch(e){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
    }
});

// OBTENER UN ASSET
app.get(BASE_API_PATH + "/asset/:id", async (req, res) => {
    console.log(Date() + " - GET /assets/:id");
    if(!ObjectId.isValid(req.params.id)){
        return res.status(StatusCodes.NOT_FOUND).json("An asset with that id could not be found, since it's not a valid id.");
    }

    var filter = { _id: req.params.id };
    Asset.findOne(filter,async function (err, asset) {
        if (err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
        }else if(asset){
            var token=await googlePhotos.get_access_token_using_saved_refresh_token();
            var googlePhotosResponse= await googlePhotos.getAsset(token,asset.file);
            asset._doc["image"]=googlePhotosResponse;
            return res.status(StatusCodes.OK).json(asset);
        }else{
            return res.status(StatusCodes.NOT_FOUND).json("An asset with that id could not be found.");
        }
    });
});

// BORRAR ASSET
app.delete(BASE_API_PATH + "/asset/:id", (req, res) => {
    console.log(Date() + " - DELETE /assets/:id");
    if(!ObjectId.isValid(req.params.id)){
        return res.status(StatusCodes.NOT_FOUND).json("An asset with that id could not be found, since it's not a valid id.");
    }

    Asset.findByIdAndDelete(req.params.id,function (err, asset) {
        if (err){
             return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
            }
        else if(asset){
            return res.status(StatusCodes.NO_CONTENT).json();
        }else{
            return res.status(StatusCodes.NOT_FOUND).json("An asset with that id could not be found.");
        }
    });
});

module.exports = app;