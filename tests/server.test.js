const app= require("../server.js");
const request= require("supertest");
var Asset = require('../models/asset.js');
const googlePhotos= require('../googlePhotos/googlePhotosService');
const authorizeToken= require("../middlewares/authorized-roles");
var ObjectId = require('mongoose').Types.ObjectId;
const serverController = require("../controllers/serverController");

const dotenv = require('dotenv');
dotenv.config();


describe("Hello world tests", ()=>{

    it("should do an stupid test", () =>{
        const a=5;
        const b=3;

        const  sum=a+b;

        expect(sum).toBe(8);
    })
})

describe("Upload service API", ()=>{

    beforeAll(()=>{

        const googleAssets=[
            {id:"file1", url: "http://www.google.com"},
            {id:"file2", url: "http://www.google.com"},
            {id:"file3", url: "http://www.google.com"}
        ]

        var dbGetAccessToken=jest.spyOn(googlePhotos,"get_access_token_using_saved_refresh_token");
        dbGetAccessToken.mockImplementation(()=>{
            return "AuthenticationToken";
        });

        var dbListAssets=jest.spyOn(googlePhotos,"listAssets");
        dbListAssets.mockImplementation( (query)=>{
            return googleAssets;
        });
    
    })

    describe("GET /asset", ()=>{

        beforeAll(()=>{

            const assets=[
                {_doc:{_id:"1",file:"file1", name: "Archivo1", user: "Usuario1"}},
                {_doc:{_id:"2",file:"file2", name: "Archivo2", user: "Usuario2"}},
                {_doc:{_id:"3",file:"file3", name: "Archivo3", user: "Usuario1"}}
            ]

            var dbFind=jest.spyOn(Asset,"find");
            dbFind.mockImplementation( ({}, query, {} , callback)=>{
                callback(null, assets)
            });

        })


        it("should return list of assets stored on DB", () =>{
            
           return request(app).get("/api/v1/asset").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
               expect(response.statusCode).toBe(200);
               expect(response.body).toBeArrayOfSize(3);
           })
        })
    })

    describe('POST /asset', () => {

        let asset;
    
        let dbInsert;

        beforeEach(() => {        
            
            asset={file:"file4", name: "Archivo4", user: "Usuario2"};

            const googleAsset={
                newMediaItemResults:[
                    {mediaItem:
                        {id:"file1", url: "http://www.google.com"}
                    }
                ]
            };
    
            var dbGetAccessToken=jest.spyOn(googlePhotos,"get_access_token_using_saved_refresh_token");
            dbGetAccessToken.mockImplementation(()=>{
                return "AuthenticationToken";
            });
    
            var dbCreatreAsset=jest.spyOn(googlePhotos,"createAsset");
            dbCreatreAsset.mockImplementation( (query)=>{
                return googleAsset;
            });
     
            dbInsert = jest.spyOn(Asset, "create");
        });

        it('Should add a new asset if everything is fine', () => {

            // var sendMessageCreatedAsset=jest.spyOn(serverController,"sendMessageCreatedAsset");
            // sendMessageCreatedAsset.mockImplementation( (query)=>{
            //     return true;
            // });
            
            dbInsert.mockImplementation(() => {
                return {
                    "file": "ALK3iGPxgKrOIwdlgn4SE8_iCTZ-gHoX9sVVY8QhCcgvzGmstAp-CVC81K7_pPU8f1M80AiJc8aKgZj_gvCVxkLAf4TxPXDRYQ",
                    "name": "Archivo4",
                    "user": "Usuario2",
                    "_id": "61d19b24c6fd0e9a4357dfcf",
                    "createdAt": "2022-01-02T12:31:32.518Z",
                    "updatedAt": "2022-01-02T12:31:32.518Z",
                    "__v": 0
                }
            });

            return request(app).post("/api/v1/asset").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                expect(response.statusCode).toBe(201);
            });
        });

        it('Should return 400 if file is not string', () => {
            asset.file= 12;

            return request(app).post("/api/v1/asset").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("File must be a string.");
            });
        });

        it('Should return 400 if file has whitespace', () => {
            asset.file= " ";
            
            return request(app).post("/api/v1/asset").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("File can't be whitespace or empty.");
            });
        });

        it('Should return 400 if file is empty', () => {
            asset.file= "";
            
            return request(app).post("/api/v1/asset").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("File can't be whitespace or empty.");
            });
        });

        it('Should return 400 if name is not string', () => {
            asset.name= 12;
            
            return request(app).post("/api/v1/asset").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("Name must be a string.");
            });
        });

        it('Should return 400 if name is has whitespace', () => {
            asset.name= " ";
            
            return request(app).post("/api/v1/asset").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("Name can't be whitespace or empty.");
            });
        });

        it('Should return 400 if name is empty', () => {
            asset.name= "";
            
            return request(app).post("/api/v1/asset").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("Name can't be whitespace or empty.");
            });
        });

        it('Should return 400 if user is not string', () => {
            asset.user= 12;
            
            return request(app).post("/api/v1/asset").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("User must be a string.");
            });
        });

        it('Should return 400 if user is has whitespace', () => {
            asset.user= " ";
            
            return request(app).post("/api/v1/asset").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("User can't be whitespace or empty.");
            });
        });

        it('Should return 400 if user is empty', () => {
            asset.user= "";
            
            return request(app).post("/api/v1/asset").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("User can't be whitespace or empty.");
            });
        });

        it('Should return 500 if there is a problem with the DB', () => {
            dbInsert.mockImplementation((c, callback) => {
                throw new Error("DB error")
            });

            return request(app).post('/api/v1/asset').set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset).then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });
    });

    describe('UPDATE /asset', () => {

        let asset;
    
        let dbInsert;

        beforeEach(() => {        
            
            asset={file:"file4", name: "Archivo4", user: "Usuario2"};

            const googleAsset={
                newMediaItemResults:[
                    {mediaItem:
                        {id:"file1", url: "http://www.google.com"}
                    }
                ]
            };
    
            dbFindOneAndUpdate = jest.spyOn(Asset, "findOneAndUpdate");
            dbFind = jest.spyOn(Asset, "findOne");

            validId= jest.spyOn(ObjectId,"isValid");

        });

        it('Should update an asset if everything is fine', () => {

            var assetToReturn={
                "file": "ALK3iGPxgKrOIwdlgn4SE8_iCTZ-gHoX9sVVY8QhCcgvzGmstAp-CVC81K7_pPU8f1M80AiJc8aKgZj_gvCVxkLAf4TxPXDRYQ",
                "name": "Archivo4",
                "user": "Usuario2",
                "_id": "61d19b24c6fd0e9a4357dfcf",
                "createdAt": "2022-01-02T12:31:32.518Z",
                "updatedAt": "2022-01-02T12:31:32.518Z",
                "__v": 0
            };

            validId.mockImplementation(() => {
                return true
            });

            dbFind.mockImplementation(() => {
                return assetToReturn;
            });

            dbFindOneAndUpdate.mockImplementation(() => {
                return assetToReturn;
            });

            return request(app).put("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
        });

        it('Should return 404 if id is not valid', () => {

            validId.mockImplementation(() => {
                return false
            });

            return request(app).put("/api/v1/asset/1").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toBe("An asset with that id could not be found, since it's not a valid id.")

            });
        });

        it('Should return 500 if there is a problemn with the DB', () => {

            validId.mockImplementation(() => {
                return true
            });

            dbFind.mockImplementation(() => {
                return assetToReturn;
            });

            dbFindOneAndUpdate.mockImplementation(() => {
                return assetToReturn;
            });

            return request(app).put("/api/v1/asset/1").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });
        
        it('Should return 400 if file is not string', () => {
            asset.file= 12;

            validId.mockImplementation(() => {
                return true
            });

            return request(app).put("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("File must be a string.")
            });
        });

        it('Should return 400 if file has whitespace', () => {
            asset.file= " ";

            validId.mockImplementation(() => {
                return true
            });
            
            return request(app).put("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("File can't be whitespace or empty.")
            });
        });

        // it('Should return 400 if file is empty', () => {
        //     asset.file= "";

        //     validId.mockImplementation(() => {
        //         return true
        //     });
            
        //     return request(app).put("asset/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
        //     .then((response) => {
        //         console.log(response);
        //          expect(response.statusCode).toBe(400);
        //          expect(response.body).toBe("File can't be whitespace or empty.")
        //     });
        // });

        it('Should return 400 if name is not string', () => {
            asset.name= 12;
            
            return request(app).put("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("Name must be a string.")
            });
        });

        it('Should return 400 if name is has whitespace', () => {
            asset.name= " ";
            
            return request(app).put("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("Name can't be whitespace or empty.")
            });
        });

        it('Should return 400 if name is empty', () => {
            asset.name= "";
            
            return request(app).put("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("Name can't be whitespace or empty.")
            });
        });

        it('Should return 400 if user is not string', () => {
            asset.user= 12;
            
            return request(app).put("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("User must be a string.")
            });
        });

        it('Should return 400 if user is has whitespace', () => {
            asset.user= " ";
            
            return request(app).put("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("User can't be whitespace or empty.")
            });
        });

        it('Should return 400 if user is empty', () => {
            asset.user= "";
            
            return request(app).put("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(400);
                 expect(response.body).toBe("User can't be whitespace or empty.")

            });
        });

        it('Should return 404 if asset not found on update', () => {            
            validId.mockImplementation(() => {
                return true
            });

            dbFind.mockImplementation(() => {
                return null;
            });

            dbFindOneAndUpdate.mockImplementation(() => {
                return null;
            });

            return request(app).put("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(404);
                 expect(response.body).toBe("An asset with that id could not be found.")
            });
        });

        it('Should return 404 if asset not found on find', () => {    
            
            var assetToReturn={
                "file": "ALK3iGPxgKrOIwdlgn4SE8_iCTZ-gHoX9sVVY8QhCcgvzGmstAp-CVC81K7_pPU8f1M80AiJc8aKgZj_gvCVxkLAf4TxPXDRYQ",
                "name": "Archivo4",
                "user": "Usuario2",
                "_id": "61d19b24c6fd0e9a4357dfcf",
                "createdAt": "2022-01-02T12:31:32.518Z",
                "updatedAt": "2022-01-02T12:31:32.518Z",
                "__v": 0
            };

            validId.mockImplementation(() => {
                return true
            });

            dbFind.mockImplementation(() => {
                return null;
            });

            dbFindOneAndUpdate.mockImplementation(() => {
                return assetToReturn;
            });

            return request(app).put("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).send(asset)
            .then((response) => {
                 expect(response.statusCode).toBe(404);
                 expect(response.body).toBe("An asset with that id could not be found.")
            });
        });

    });

    describe("GET /asset/:id", ()=>{

        var validId;
        var dbFind;
        var dbGetAccessToken;
        var dbGetAsset;

        beforeAll(()=>{

            const asset={_doc:{_id:"61d19b24c6fd0e9a4357dfcf",file:"file1", name: "Archivo1", user: "Usuario1"}};

            validId=jest.spyOn(ObjectId,"isValid");

            dbFind=jest.spyOn(Asset,"findOne");

            dbFind.mockImplementation((query, callback)=>{
                callback(null, asset)
            });
        
            var googleAsset={id:"file1", url: "http://www.google.com"};
    
            dbGetAccessToken=jest.spyOn(googlePhotos,"get_access_token_using_saved_refresh_token");
    
            dbGetAsset=jest.spyOn(googlePhotos,"getAsset");

            dbGetAccessToken.mockImplementation(()=>{
                return "AuthenticationToken";
            });

            dbGetAsset.mockImplementation( ()=>{
                return googleAsset;
            });

        });


        it("Should return 404 if id is not valid", () =>{

            validId.mockImplementation(() => {
                return false
            });
            
           return request(app).get("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
               expect(response.statusCode).toBe(404);
               expect(response.body).toBe("An asset with that id could not be found, since it's not a valid id.");
           })
        });

        it("Should return asset with concrete id", () =>{

            validId.mockImplementation(() => {
                return true
            });
            
           return request(app).get("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
                expect(response.statusCode).toBe(200);
           })
        });

        it("Should return 404 if asset is not found", () =>{

            validId.mockImplementation(() => {
                return true
            });

            dbFind.mockImplementation((query, callback)=>{
                callback(null, null)
            });
            
           return request(app).get("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
                expect(response.statusCode).toBe(404);
                expect(response.body).toBe("An asset with that id could not be found.");
            })
        });

        it("Should return 500 if there is a problem with the db", () =>{

            validId.mockImplementation(() => {
                return true
            });

            dbFind.mockImplementation((query, callback)=>{
                callback(true, null)
            });
            
           return request(app).get("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
                expect(response.statusCode).toBe(500);
            })
        });
    })

    describe("GET /asset/user/:user", ()=>{

        var validId;
        var dbFind;
        var dbGetAccessToken;
        var dbGetAsset;

        beforeAll(()=>{

            const asset=[{_doc:{_id:"61d19b24c6fd0e9a4357dfcf",file:"file1", name: "Archivo1", user: "Usuario1"}}];

            // validId=jest.spyOn(ObjectId,"isValid");

            dbFind=jest.spyOn(Asset,"find");

            dbFind.mockImplementation((query, callback)=>{
                callback(null, asset)
            });
        
            // var googleAsset={id:"file1", url: "http://www.google.com"};
            // dbGetAccessToken=jest.spyOn(googlePhotos,"get_access_token_using_saved_refresh_token");
            // dbGetAsset=jest.spyOn(googlePhotos,"getAsset");
            // dbGetAccessToken.mockImplementation(()=>{
            //     return "AuthenticationToken";
            // });
            // dbGetAsset.mockImplementation( ()=>{
            //     return googleAsset;
            // });

        });

        // it("Should return 404 if id is not valid", () =>{

        //     validId.mockImplementation(() => {
        //         return false
        //     });
            
        //    return request(app).get("/api/v1/asset/user/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
        //        expect(response.statusCode).toBe(404);
        //        expect(response.body).toBe("An asset with that id could not be found, since it's not a valid id.");
        //    })
        // });

        it("Should return list of asset of user", () =>{
            
           return request(app).get("/api/v1/asset/user/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
                expect(response.statusCode).toBe(200);
           })
        });

        // it("Should return 404 if asset is not found", () =>{

        //     validId.mockImplementation(() => {
        //         return true
        //     });

        //     dbFind.mockImplementation((query, callback)=>{
        //         callback(null, null)
        //     });
            
        //    return request(app).get("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
        //         expect(response.statusCode).toBe(404);
        //         expect(response.body).toBe("An asset with that id could not be found.");
        //     })
        // });

        it("Should return 500 if there is a problem with the db", () =>{

            dbFind.mockImplementation((query, callback)=>{
                callback(true, null)
            });
            
           return request(app).get("/api/v1/asset/user/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
                expect(response.statusCode).toBe(500);
            })
        });
    })

    describe("DELETE /asset/:id", ()=>{

        var validId;
        var dbFind;

        beforeEach(()=>{

            validId=jest.spyOn(ObjectId,"isValid");

            dbFind=jest.spyOn(Asset,"findByIdAndDelete");

            dbFind.mockImplementation((query, callback)=>{
                callback(null, true)
            });
        
        });

        it("Should return 404 if id is not valid", () =>{

            validId.mockImplementation(() => {
                return false
            });
            
           return request(app).delete("/api/v1/asset/user/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
               expect(response.statusCode).toBe(404);
            //    expect(response.body).toBe("An asset with that id could not be found, since it's not a valid id.");
           })
        });

        // it("Should delete asset with concrete id", () =>{

        //     validId.mockImplementation(() => {
        //         return true
        //     });

        //     dbFind.mockImplementation((query, callback)=>{
        //         callback(false, true)
        //     });
            
        //    return request(app).delete("/api/v1/asset/user/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
        //         expect(response.statusCode).toBe(204);
        //    })
        // });

        // it("Should return 500 if there is a problem with the db", () =>{

        //     dbFind.mockImplementation((query, callback)=>{
        //         callback(true, null)
        //     });
            
        //    return request(app).delete("/api/v1/asset/61d19b24c6fd0e9a4357dfcf").set("Authorization",`Bearer `+ process.env.SAMPLE_JWT).then((response)=>{
        //         expect(response.statusCode).toBe(500);
        //     })
        // });
    })
})


