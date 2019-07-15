const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const Users = require('../../models/User');

// @route           GET api/profile/me
// @description     Get current users profile
// @access          Private (beause we are sending in token)
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is NO profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server ERror');
  }
});

// @route           POST api/profile
// @description     Create or update user profile
// @access          Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status IS required')
        .not()
        .isEmpty(),
      check('skills', 'Skills IS required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id; //apply user id to that user. current one.
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim()); //turns strings into an array.
    }

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      //if profile exist, update it.
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile); //return entire profile.
      }

      //Create new profile if it doesn't exist.
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server ERROOOR');
    }
  }
);

// @route           GET api/profile
// @description     Get all profiles.
// @access          Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server eRrOr');
  }
});

// @route           GET api/profile/user/:user_id
// @description     Get profile by user ID
// @access          Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'PROFile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'PRofile not found' });
    }
    res.status(500).send('Server eRrOr');
  }
});

// @route           DELETE api/profile
// @description     Delete profile, user, and posts
// @access          Private

router.delete('/', auth, async (req, res) => {
  try {
    //@todo = Remove users post.

    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User delEted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server eRrOr');
  }
});

// @route           PUT api/profile/experience
// @description     Add profile experience
// @access          Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is require')
        .not()
        .isEmpty(),
      check('company', 'Company is require')
        .not()
        .isEmpty(),
      check('from', 'From date is require')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      locaiton,
      from,
      to,
      current,
      description
    } = req.body;

    //Creates object with data that user submits.
    const newExp = {
      title,
      company,
      locaiton,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('SeRVer ERROR');
    }
  }
);

// @route           DELETE api/profile/experience/:exp_id
// @description     Delete experience from profile
// @access          Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1); //splice out the index.

    await profile.save(); //save profile

    res.json(profile); //send profile back.
  } catch (err) {
    console.error(err.message);
    res.status(500).send('SeRVer ERROR');
  }
});

module.exports = router;
