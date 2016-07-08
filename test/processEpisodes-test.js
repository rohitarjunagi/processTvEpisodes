//import the required modules
var assert = require('chai').assert;
var express = require('express');
var bodyParser = require('body-parser');
var processEpisodes = require('../ProcessEpisodes');
var request = require('supertest');
//instantiate processEpisodes module
var processEpisodesData = new processEpisodes();
//grab an instance of express
var app = express();
//configure express to be used to test the application
app.use(bodyParser.json());
app.use(processEpisodesData.setupRoutes());

app.use(function(err, req, res, next) {
  res.status(400).send({
    "error": "Could not decode request: JSON parsing failed"
  });
});

describe('Test the ProcessEpisodes library::', function() {

  it("Responds with 200 for the correct episodes data::", function(done) {
    var input_data = {
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
    var expected_response = '{"response":[{"image":"http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg","slug":"show/16kidsandcounting","title":"16 Kids and Counting"},{"image":"http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg","slug":"show/thetaste","title":"The Taste"}]}';

    request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(input_data)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        try {
          assert.deepEqual(res.text, expected_response);
        } catch (err) {
          return done(err);
        }
        done();
      });
  });

  it("Responds with 400 if request body is empty::", function(done) {
    var input_data = {};
    var expected_response = '{"error":"Could not decode request: JSON parsing failed"}';

    request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(input_data)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        try {
          assert.deepEqual(res.text, expected_response);
        } catch (err) {
          return done(err);
        }
        done();
      });
  });

  it("Responds with 400 if json data is invalid::", function(done) {
    var expected_response = '{"error":"Could not decode request: JSON parsing failed"}';
    var input_data = 'invalid json';
    request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(input_data)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        try {
          assert.deepEqual(res.text, expected_response);
        } catch (err) {
          return done(err);
        }
        done();
      });
  });

  it("Responds with 400 if 'payload' is not present within the input data::", function(done) {
    var input_data = {
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
    var expected_response = '{"error":"Could not decode request: JSON parsing failed"}';
    request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(input_data)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);

        try {
          assert.deepEqual(res.text, expected_response);
        } catch (err) {
          return done(err);
        }
        done();
      });
  });

  it("Responds with 400 if payload length is 0::", function(done) {
    var input_data = {
      "payload": [],
      "skip": 0,
      "take": 10,
      "totalRecords": 75
    };
    var expected_response = '{"error":"Could not decode request: JSON parsing failed"}';
    request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(input_data)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);

        try {
          assert.deepEqual(res.text, expected_response);
        } catch (err) {
          return done(err);
        }
        done();
      });
  });

  it("If drm is false, does not include the episode details in response::", function(done) {
    var input_data = {
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
    var expected_response = '{"response":[{"image":"http://mybeautifulcatchupservice.com/img/shows/16KidsandCounting1280.jpg","slug":"show/16kidsandcounting","title":"16 Kids and Counting"}]}';
    request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(input_data)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        try {
          assert.deepEqual(res.text, expected_response);
        } catch (err) {
          return done(err);
        }
        done();
      });
  });

  it("If episodeCount is less than 0, does not include the episode details in response::", function(done) {
    var input_data = {
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
    var expected_response = '{"response":[{"image":"http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg","slug":"show/thetaste","title":"The Taste"}]}';
    request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(input_data)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        try {
          assert.deepEqual(res.text, expected_response);
        } catch (err) {
          return done(err);
        }
        done();
      });
  });

  it("If episodeCount is not a number, does not include the episode details in response::", function(done) {
    var input_data = {
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
    var expected_response = '{"response":[{"image":"http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg","slug":"show/thetaste","title":"The Taste"}]}';
    request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(input_data)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        try {
          assert.deepEqual(res.text, expected_response);
        } catch (err) {
          return done(err);
        }
        done();
      });
  });

  it("If drm is not a boolean type, does not include the episode details in response::", function(done) {
    var input_data = {
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
    var expected_response = '{"response":[{"image":"http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg","slug":"show/thetaste","title":"The Taste"}]}';
    request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(input_data)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        try {
          assert.deepEqual(res.text, expected_response);
        } catch (err) {
          return done(err);
        }
        done();
      });
  });

it("If image element is not a present in the episode details, '' is shown in response image element::", function(done) {
    var input_data = {
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
    var expected_response = '{"response":[{"image":"","slug":"show/16kidsandcounting","title":"16 Kids and Counting"},{"image":"http://mybeautifulcatchupservice.com/img/shows/TheTaste1280.jpg","slug":"show/thetaste","title":"The Taste"}]}';
    request(app)
      .post("/")
      .set("Content-Type", "application/json")
      .send(input_data)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        try {
          assert.deepEqual(res.text, expected_response);
        } catch (err) {
          return done(err);
        }
        done();
      });
  });

});