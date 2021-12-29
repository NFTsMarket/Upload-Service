const {google} = require('googleapis');
const Photos = require('googlephotos');
var fs = require("fs");

const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, null);

const scopes = [Photos.Scopes.READ_ONLY, Photos.Scopes.SHARING, Photos.Scopes.APPEND_ONLY];
const albumId="ALK3iGMnoLmAQVdCEJO9v_9jjhqNpcdmxZd4Jk7CG322R-uyk38uDIxI-irV8rsDxZufi_QB5pqv";

async function get_access_token_using_saved_refresh_token() {
    // from the oauth playground
    const refresh_token = process.env.REFRESH_TOKEN;
    // from the API console
    const client_id = process.env.CLIENT_ID;
    // from the API console
    const client_secret = process.env.CLIENT_SECRET;
    // from https://developers.google.com/identity/protocols/OAuth2WebServer#offline
    const refresh_url = "https://www.googleapis.com/oauth2/v4/token";

    const post_body = `grant_type=refresh_token&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}&refresh_token=${encodeURIComponent(refresh_token)}`;

    let refresh_request = {
        body: post_body,
        method: "POST",
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        })
    }

    // post to the refresh endpoint, parse the json response and use the access token to call files.list
    var response= await fetch(refresh_url, refresh_request).then( response => {
            return response.json()
        })
        
    return response.access_token

}

async function listAssets (access_token) {
    const photos = new Photos(access_token);
    
    const response = await photos.mediaItems.search(albumId);

    return response.mediaItems;
}

async function createAsset (access_token,body) {
    const photos = new Photos(access_token);
    
    const response = await photos.mediaItems.upload(albumId, body.name, body.file, body.name);

    return response;
}

async function getAsset (access_token,assetId) {
    const photos = new Photos(access_token);
    
    const response = await photos.mediaItems.get(assetId);

    return response;
}

async function initializeGoogleCloud(){
    const url = oauth2Client.generateAuthUrl({
    access_type: 'online',

    scope: scopes,
    });

    var token= await get_access_token_using_saved_refresh_token();
    return token;
}

module.exports={initializeGoogleCloud, getAsset, listAssets,createAsset, get_access_token_using_saved_refresh_token}