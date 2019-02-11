const express = require('express');
const router = express.Router();
const Category = require('../models/category');

/*
 * GET pages index
*/
router.get('/', function (req, res) {
    Category.find()
        .then(categories => {
            res.render('admin/categories', {
                categories: categories
            })
        })
        .catch(err => {
            return	console.log("err in getting pages form Page moder", err);
        });
});

/*
 * POST add category
*/
router.post('/add-category', function (req, res) {

    req.checkBody('title', 'Title must have a value').notEmpty();

    let title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();

    let errors = req.validationErrors();
    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title,
        });
    } else {
        Category.findOne({ slug: slug })
            .then(category => {
                if (category) {
                    req.flash('danger', 'Category title already exists, choose another.');
                    res.render('admin/add_category', {
                        title: title,
                    });
                }
                else {
                    let category = new Category({
                        title: title,
                        slug: slug,
                    });

                    category.save(function (err) {
                        if (err)
                            return console.log(err);
                        req.flash('success', 'Category added!');
                        res.redirect('/admin/categories');
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
 * GET add category
*/
router.get('/add-category', function (req, res) {
    let title = "";

    res.render('admin/add_category', {
        title: title,
    });
});


/*
 * GET edit category
*/
router.get('/edit-category/:id', function (req, res) {
    Category.findById(req.params.id )
        .then(category => {
            res.render('admin/edit_category', {
                title: category.title,
                id: category._id
            });
        })
        .catch(err => {
            return console.log(err);
        });
});

/*
 * POST edit page
*/
router.post('/edit-category/:id', function (req, res) {

    req.checkBody('title', 'Title must have a value').notEmpty();

    let title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();
    let id = req.params.id;

    let errors = req.validationErrors();
    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    } else {
        Category.findOne({ slug: slug, _id: { '$ne': id } })
            .then(category => {
                if (category) {
                    req.flash('danger', 'Category title already exists, choose another.');
                    res.render('admin/edit_category', {
                        title: title,
                        id: id
                    });
                }
                else {
                    Category.findById(id, function (err, category) {
                        if (err) {
                            return console.log(err);
						}
                        category.title = title;
                        category.slug = slug;

                        category.save(function (err) {
                            if (err)
                                return console.log(err);
                            req.flash('success', 'Category edited!');
                            res.redirect('/admin/categories/edit-category/' + id);
                        });
                    })
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
 * GET delete category
*/
router.get('/delete-category/:id', function (req, res) {
    Category.findByIdAndRemove(req.params.id).then(success => {
        req.flash('success', 'Category deleted!');
        res.redirect('/admin/categories');
    })
        .catch(err => {
            return console.log(err);
        })
});

// Exports
module.exports = router;