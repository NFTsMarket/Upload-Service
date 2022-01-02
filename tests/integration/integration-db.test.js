const Asset = require('../../models/asset');
const mongoose = require('mongoose');
const dbConnect = require('../../db');

describe('Asset DB connection', () => {
    beforeAll(() => {
        return dbConnect();
    });

    beforeEach((done) => {
        Asset.deleteMany({}, (err) => {
            done();
        });
    });

    it('writes an asset in the DB', (done) => {
        const asset = new Asset({file: 'test.jpg', name: 'test', user: 'test'});
        asset.save((err,asset) => {
            expect(err).toBeNull();
            Asset.find({}, (err, assets) => {
                expect(assets).toBeArrayOfSize(1);
                done();
            });
        });
    });
    afterAll((done) => {
        mongoose.connection.db.dropDatabase(()=> {
            mongoose.connection.close(done);
        });
    });
})