const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route           GET api/auth
// @description     Test route
// @access          Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//PASTE CODE HERE!
// @route           POST api/auth
// @description     Authenticate user & get token
// @access          Public
router.post(
  '/',
  [
    check('email', 'please include valid email').isEmail(),
    check('password','Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //if there ARE errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //400 = bad request
    }

    const {email, password } = req.body;

    try {
      //See if user exist
      let user = await User.findOne({ email }); //goes to line 32. Grabs email.

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid CRedentials' }] });
      }


      const isMatch = await bcrypt.compare(password, user.password);
      //password is plain text. user.password is encrypted.

      if (!isMatch){
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid CREdentials' }] });
      }


      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      //change to 3600 when done.
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err; //error
          res.json({ token }); //no error? send token
        }
      );
    } catch (err) {
      //if there is a server error
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

