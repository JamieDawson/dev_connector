const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//User model
const User = require('../../models/User');

// @route           POST api/users
// @description     Register user
// @access          Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'please include valid email').isEmail(),
    check(
      'password',
      'please enter a password with 6 or more characters'
    ).isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    //if there ARE errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //400 = bad request
    }

    const { name, email, password } = req.body;

    try {
      //See if user exist
      let user = await User.findOne({ email }); //goes to line 32. Grabs email.

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exist' }] });
      }

      //Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', //size 200px.
        r: 'pg', //pg rating. No nudity.
        d: 'mm' //default image
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      //Encrypt password (using bcrypt)
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt); //create hash. put in user.password

      await user.save(); //gives a promise

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
