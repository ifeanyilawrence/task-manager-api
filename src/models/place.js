const mongoose = require('mongoose');

const placeSchema = mongoose.Schema({
    key: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    image: {
        type: String,
        required: true
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