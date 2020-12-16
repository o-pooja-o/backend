
const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const User = require("../../models/Users");
//REGISTER
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    //check if user available
    User.findOne({ number: req.body.number }).then(user => {
        if (user) {
            return res.status(400).json({ number: "Number already exists" });
        }
        else {
            // const newUser = new User({
            //     name: req.body.name,
            //     number: req.body.number,
            //     password: req.body.password
            // });
            // Hash password before saving in database
            bcrypt.genSalt(10).then(salt => {
                bcrypt.hash(req.body.password, salt).then((hashedPassword, err) => {
                    if (err) throw err;
                    const newUser = new User({
                        name: req.body.name,
                        number: req.body.number,
                        password: hashedPassword,
                    })
                    newUser.save().then(user => {
                        res.send(user);
                    }).catch(err => res.status(400).send(err.message));
                })
            })

            // bcrypt.genSalt(10, (err, salt) => {
            //     bcrypt.hash(newUser.password, salt, (err, hash) => {
            //         if (err) throw err;
            //         newUser.password = hash;
            //         newUser
            //             .save()
            //             .then(user => res.json(user))
            //             .catch(err => console.log(err));
            //     });
            // });
        }
    });
});

//LOGIN
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const password = req.body.password;
    // Find user by number
    User.findOne({ number: req.body.number }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ numbernotfound: "number not found" });
        }
        // compare password
        bcrypt.compare(password, user.password).then(validPass => {
            if (validPass) {
                // Sign token
                const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: 2629746 });//1 month
                res.header('auth-token', token).send(token);
                // res.json({ success: true, token: " Bearer" + token });
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        })
    });
});

module.exports = router;
