const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    image: {
        type: String
    },
    location: {
        type: Map,
        of: Number,
        required: true
      }
}, {
    timestamps: true
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;