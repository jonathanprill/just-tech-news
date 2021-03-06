//  This file will contain all of the user-facing routes, such as the homepage and login page.

const router = require('express').Router();

//Importing necessary modules and models
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');


router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            //This will loop over and map each Sequelize object into a serialized version of itself
            const posts = dbPostData.map(post => post.get({ plain: true }));
            // pass a single post object into the homepage template
            //console.log(dbPostData[0]);
            // Ensure login
            res.render('homepage', {
                posts,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//login 
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        // redirect users away from the login page
        res.redirect('/');
        return;
    }

    res.render('login');
});

//Single Post
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });

            // pass a session variable to the template
            res.render('single-post', {
                post,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;


// NOTES
// Example middleware:
// app.get('/',
//     (req, res, next) => {
//         console.log('first middleware');
//         next();
//     },
//     (req, res, next) => {
//         console.log('second middleware');
//         next();
//     },
//     (req, res) => {
//         console.log('final function call');
//         res.send('ok');
//     }
// );
// Calling next() in one of these functions calls the next middleware function,
// passing along the same req and res values.