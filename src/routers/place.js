const express = require('express');
const Place = require('../models/place');
const router = new express.Router();
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
    const key = req.params.id;

    try {
        const place = await Place.findOne({ key });

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

router.delete('/places/:id', async (req, res) => {
    try {
        const place = await Place.findOneAndDelete({ key: req.params.id });

        if (!place) {
            return res.status(404).send({error: 'Place not found!'});
        }
        res.send(place);
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;