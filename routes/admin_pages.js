const express = require('express');
const router = express.Router();
const Page = require('../models/page');

/*
 * GET pages index
*/
router.get('/', function (req, res) {
    Page.find({}).sort({sorting: 1}).exec()
        .then(pages => {
            res.render('admin/pages',{
                pages: pages
            })
        })
        .catch(err => {
            console.log("err in getting pages form Page moder",err);
        });
});

/*
 * POST add page
*/
router.post('/add-page', function (req, res) {

    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('title', 'Title must have a value').notEmpty();

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    let content = req.body.content;

    let errors = req.validationErrors();
    if (errors) {
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        Page.findOne({ slug: slug })
            .then(page => {
                if (page) {
                    req.flash('danger', 'Page slug already exists, choose another.');
                    res.render('admin/add_page', {
                        title: title,
                        slug: slug,
                        content: content
                    });
                }
                else {
                    let page = new Page({
                        title: title,
                        slug: slug,
                        content: content,
                        sorting: 100
                    });

                    page.save(function (err) {
                        if (err)
                            return console.log(err);
                        req.flash('success', 'Page added!');
                        res.redirect('/admin/pages');
                    });
                }

            })
            .catch(err => {
                console.log('Error in finding page', err);
                req.flash('danger', 'Error in finding/saving page - db error.');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            });
    }
});

/*
 * GET add page
*/
router.get('/add-page', function (req, res) {
    let title = "";
    let slug = "";
    let content = "";

    res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content
    });
});


// Exports
module.exports = router;