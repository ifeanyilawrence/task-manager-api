const express = require('express');
const Place = require('../models/place');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
//const auth = require('../middleware/auth');

router.post('/places', async (req, res) => {
    console.log("Got here!");
    const place = new Place({
        ...req.body
    });

    try {
        await place.save();
        res.status(201).send(place);
    } catch (error) {
        res.status(400).send(error);
    }
});

//GET /tasks?completed=true => filtering
//GET /tasks?limit=10&skip=10 => pagination
//GET /tasks?sortBy=createdAt:desc
router.get('/places', async (req, res) => {

    try {
        places = await Place.find({});
        res.send(places);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/places/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const place = await Place.findOne({ _id });

        if (!place) {
            return res.status(404).send('Place not found!');
        }
        res.send(place);
    } catch (error) {
        res.status(500).send(error);
    }
});

// router.patch('/places/:id', auth, async (req, res) => {
//     const updates = Object.keys(req.body);
//     const allowedUpdates = ['description', 'completed'];
//     const isValidOperation = updates.every(update => allowedUpdates.includes(update));

//     if (!isValidOperation) {
//         return res.status(400).send({error: 'Invalid Updates!'});
//     }

//     try {
//         const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});

//         if (!task) {
//             return res.status(404).send({error: 'Task not found!'});
//         }

//         updates.forEach(update => task[update] = req.body[update]);
//         await task.save();

//         res.send(task);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    
    cb(null, true);
};

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage, limits: { fileSize:5000000 }, fileFilter: imageFilter });

router.post('/places/fileupload', upload.single('image'), (req, res) => {
    try {

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }

        res.send(req.hostname + '/' + req.file.path.split("/")[1] + '/' + req.file.path.split("/")[2]);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/places/:id', async (req, res) => {
    try {
        const place = await Place.findOneAndDelete({ _id: req.params.id });

        if (!place) {
            return res.status(404).send({ error: 'Place not found!' });
        }
        res.send(place);
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;