
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const assert = chai.assert;

chai.use(chaiHttp);

describe('Test the ProcessEpisodes library::', function () {

    it("Responds with 200 for the correct episodes data::", function (done) {
        const input_data = {
            "payload": [{
                "country": "UK",
                "description": "What's life like when you have enough children to field your own football team?",
                "drm": true,
                "episodeCount": 3,
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg"
                },
                "slug": "show/16kidsandcounting",
                "title": "16 Kids and Counting",
                "tvChannel": "GEM"
            }, {
                "slug": "show/seapatrol",
                "title": "Sea Patrol",
                "tvChannel": "Channel 9"
            }, {
                "country": " USA",
                "description": "The Taste puts 16 culinary competitors in the kitchen, where four of the World's most notable culinary masters of the food world judges their creations based on a blind taste. Join judges Anthony Bourdain, Nigella Lawson, Ludovic Lefebvre and Brian Malarkey in this pressure-packed contest where a single spoonful can catapult a contender to the top or send them packing.",
                "drm": true,
                "episodeCount": 2,
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg"
                },
                "slug": "show/thetaste",
                "title": "The Taste",
                "tvChannel": "GEM"
            }]
        };
        const expected_response = '{"response":[{"image":"http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg","slug":"show/16kidsandcounting","title":"16 Kids and Counting"},{"image":"http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg","slug":"show/thetaste","title":"The Taste"}]}';

        chai.request(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send(input_data)
            .end(function (err, res) {
                if (err) return done(err);

                try {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.text, expected_response);
                } catch (err) {
                    return done(err);
                }
                done();
            });
    });

    it("Responds with 400 if request body is empty::", function (done) {
        const input_data = {};
        const expected_response = '{"error":"Could not decode request: JSON parsing failed"}';

        chai.request(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send(input_data)
            .end(function (err, res) {
                if (err) return done(err);
                try {
                    assert.equal(res.status, 400);
                    assert.deepEqual(res.text, expected_response);
                } catch (err) {
                    return done(err);
                }
                done();
            });
    });

    it("Responds with 400 if json data is invalid::", function (done) {
        const expected_response = '{"error":"Could not decode request: JSON parsing failed"}';
        const input_data = 'invalid json';
        chai.request(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send(input_data)
            .end(function (err, res) {
                if (err) return done(err);
                try {
                    assert.equal(res.status, 400);
                    assert.deepEqual(res.text, expected_response);
                } catch (err) {
                    return done(err);
                }
                done();
            });
    });

    it("Responds with 400 if 'payload' is not present within the input data::", function (done) {
        const input_data = {
            "payload12345": [{
                "country": "UK",
                "description": "What's life like when you have enough children to field your own football team?",
                "drm": true,
                "episodeCount": 3,
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg"
                },
                "slug": "show/16kidsandcounting",
                "title": "16 Kids and Counting",
                "tvChannel": "GEM"
            }, {
                "slug": "show/seapatrol",
                "title": "Sea Patrol",
                "tvChannel": "Channel 9"
            }, {
                "country": " USA",
                "description": "The Taste puts 16 culinary competitors in the kitchen, where four of the World's most notable culinary masters of the food world judges their creations based on a blind taste. Join judges Anthony Bourdain, Nigella Lawson, Ludovic Lefebvre and Brian Malarkey in this pressure-packed contest where a single spoonful can catapult a contender to the top or send them packing.",
                "drm": true,
                "episodeCount": 2,
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg"
                },
                "slug": "show/thetaste",
                "title": "The Taste",
                "tvChannel": "GEM"
            }]
        };
        const expected_response = '{"error":"Could not decode request: JSON parsing failed"}';
        chai.request(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send(input_data)
            .end(function (err, res) {
                if (err) return done(err);

                try {
                    assert.equal(res.status, 400);
                    assert.deepEqual(res.text, expected_response);
                } catch (err) {
                    return done(err);
                }
                done();
            });
    });

    it("Responds with 400 if payload length is 0::", function (done) {
        const input_data = {
            "payload": [],
            "skip": 0,
            "take": 10,
            "totalRecords": 75
        };
        const expected_response = '{"error":"Could not decode request: JSON parsing failed"}';
        chai.request(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send(input_data)
            .end(function (err, res) {
                if (err) return done(err);

                try {
                    assert.equal(res.status, 400);
                    assert.deepEqual(res.text, expected_response);
                } catch (err) {
                    return done(err);
                }
                done();
            });
    });

    it("If drm is false, does not include the episode details in response::", function (done) {
        const input_data = {
            "payload": [{
                "country": "UK",
                "description": "What's life like when you have enough children to field your own football team?",
                "drm": true,
                "episodeCount": 3,
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg"
                },
                "slug": "show/16kidsandcounting",
                "title": "16 Kids and Counting",
                "tvChannel": "GEM"
            }, {
                "slug": "show/seapatrol",
                "title": "Sea Patrol",
                "tvChannel": "Channel 9"
            }, {
                "country": " USA",
                "description": "The Taste puts 16 culinary competitors in the kitchen, where four of the World's most notable culinary masters of the food world judges their creations based on a blind taste. Join judges Anthony Bourdain, Nigella Lawson, Ludovic Lefebvre and Brian Malarkey in this pressure-packed contest where a single spoonful can catapult a contender to the top or send them packing.",
                "drm": false,
                "episodeCount": 2,
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg"
                },
                "slug": "show/thetaste",
                "title": "The Taste",
                "tvChannel": "GEM"
            }]
        };;
        const expected_response = '{"response":[{"image":"http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg","slug":"show/16kidsandcounting","title":"16 Kids and Counting"}]}';
        chai.request(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send(input_data)
            .end(function (err, res) {
                if (err) return done(err);

                try {
                    assert.equal(res.status, 200)
                    assert.deepEqual(res.text, expected_response);
                } catch (err) {
                    return done(err);
                }
                done();
            });
    });

    it("If episodeCount is less than 0, does not include the episode details in response::", function (done) {
        const input_data = {
            "payload": [{
                "country": "UK",
                "description": "What's life like when you have enough children to field your own football team?",
                "drm": true,
                "episodeCount": -2,
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg"
                },
                "slug": "show/16kidsandcounting",
                "title": "16 Kids and Counting",
                "tvChannel": "GEM"
            }, {
                "slug": "show/seapatrol",
                "title": "Sea Patrol",
                "tvChannel": "Channel 9"
            }, {
                "country": " USA",
                "description": "The Taste puts 16 culinary competitors in the kitchen, where four of the World's most notable culinary masters of the food world judges their creations based on a blind taste. Join judges Anthony Bourdain, Nigella Lawson, Ludovic Lefebvre and Brian Malarkey in this pressure-packed contest where a single spoonful can catapult a contender to the top or send them packing.",
                "drm": true,
                "episodeCount": 3,
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg"
                },
                "slug": "show/thetaste",
                "title": "The Taste",
                "tvChannel": "GEM"
            }]
        };;
        const expected_response = '{"response":[{"image":"http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg","slug":"show/thetaste","title":"The Taste"}]}';
        chai.request(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send(input_data)
            .end(function (err, res) {
                if (err) return done(err);

                try {
                    assert.equal(res.status, 200)
                    assert.deepEqual(res.text, expected_response);
                } catch (err) {
                    return done(err);
                }
                done();
            });
    });

    it("If episodeCount is not a number, does not include the episode details in response::", function (done) {
        const input_data = {
            "payload": [{
                "country": "UK",
                "description": "What's life like when you have enough children to field your own football team?",
                "drm": true,
                "episodeCount": "Helloo!!",
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg"
                },
                "slug": "show/16kidsandcounting",
                "title": "16 Kids and Counting",
                "tvChannel": "GEM"
            }, {
                "slug": "show/seapatrol",
                "title": "Sea Patrol",
                "tvChannel": "Channel 9"
            }, {
                "country": " USA",
                "description": "The Taste puts 16 culinary competitors in the kitchen, where four of the World's most notable culinary masters of the food world judges their creations based on a blind taste. Join judges Anthony Bourdain, Nigella Lawson, Ludovic Lefebvre and Brian Malarkey in this pressure-packed contest where a single spoonful can catapult a contender to the top or send them packing.",
                "drm": true,
                "episodeCount": 3,
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg"
                },
                "slug": "show/thetaste",
                "title": "The Taste",
                "tvChannel": "GEM"
            }]
        };;
        const expected_response = '{"response":[{"image":"http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg","slug":"show/thetaste","title":"The Taste"}]}';
        chai.request(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send(input_data)
            .end(function (err, res) {
                if (err) return done(err);

                try {
                    assert.equal(res.status, 200)
                    assert.deepEqual(res.text, expected_response);
                } catch (err) {
                    return done(err);
                }
                done();
            });
    });

    it("If drm is not a boolean type, does not include the episode details in response::", function (done) {
        const input_data = {
            "payload": [{
                "country": "UK",
                "description": "What's life like when you have enough children to field your own football team?",
                "drm": true,
                "episodeCount": "Helloo!!",
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg"
                },
                "slug": "show/16kidsandcounting",
                "title": "16 Kids and Counting",
                "tvChannel": "GEM"
            }, {
                "slug": "show/seapatrol",
                "title": "Sea Patrol",
                "tvChannel": "Channel 9"
            }, {
                "country": " USA",
                "description": "The Taste puts 16 culinary competitors in the kitchen, where four of the World's most notable culinary masters of the food world judges their creations based on a blind taste. Join judges Anthony Bourdain, Nigella Lawson, Ludovic Lefebvre and Brian Malarkey in this pressure-packed contest where a single spoonful can catapult a contender to the top or send them packing.",
                "drm": true,
                "episodeCount": 3,
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg"
                },
                "slug": "show/thetaste",
                "title": "The Taste",
                "tvChannel": "GEM"
            }]
        };;
        const expected_response = '{"response":[{"image":"http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg","slug":"show/thetaste","title":"The Taste"}]}';

        chai.request(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send(input_data)
            .end(function (err, res) {
                if (err) return done(err);

                try {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.text, expected_response);
                } catch (err) {
                    return done(err);
                }
                done();
            });
    });

    it("If image element is not a present in the episode details, '' is shown in response image element::", function (done) {
        const input_data = {
            "payload": [{
                "country": "UK",
                "description": "What's life like when you have enough children to field your own football team?",
                "drm": true,
                "episodeCount": 3,
                "slug": "show/16kidsandcounting",
                "title": "16 Kids and Counting",
                "tvChannel": "GEM"
            }, {
                "slug": "show/seapatrol",
                "title": "Sea Patrol",
                "tvChannel": "Channel 9"
            }, {
                "country": " USA",
                "description": "The Taste puts 16 culinary competitors in the kitchen, where four of the World's most notable culinary masters of the food world judges their creations based on a blind taste. Join judges Anthony Bourdain, Nigella Lawson, Ludovic Lefebvre and Brian Malarkey in this pressure-packed contest where a single spoonful can catapult a contender to the top or send them packing.",
                "drm": true,
                "episodeCount": 3,
                "image": {
                    "showImage": "http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg"
                },
                "slug": "show/thetaste",
                "title": "The Taste",
                "tvChannel": "GEM"
            }]
        };;
        const expected_response = '{"response":[{"image":"","slug":"show/16kidsandcounting","title":"16 Kids and Counting"},{"image":"http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg","slug":"show/thetaste","title":"The Taste"}]}';
        chai.request(app)
            .post("/")
            .set("Content-Type", "application/json")
            .send(input_data)
            .end(function (err, res) {
                if (err) return done(err);

                try {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.text, expected_response);
                } catch (err) {
                    return done(err);
                }
                done();
            });
    });

});