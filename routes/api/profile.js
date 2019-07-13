const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const Users = require('../../models/User');

// @route           GET api/profile/me
// @description     Get current users profile
// @access          Private (beause we are sending in token)
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
         ['name', 'avatar']);

         if (!profile) {
             return res.status(400).json({ msg: 'There is NO profile for this user'});
         }

         res.json(profile);
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server ERror');
    }
});

module.exports = router;
