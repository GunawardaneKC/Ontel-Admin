const router = require('express').Router()
const categoryCtrl = require('../controllers/categoryCtrl')
// const auth = require('../middleware/auth')
// const authAdmin = require('../middleware/authAdmin')


router.route('/category')
    .get(categoryCtrl.getCategories)
    .post(categoryCtrl.createCategory)

router.route('/category/:id')
    .delete(categoryCtrl.deleteCategory)
    .put(categoryCtrl.updateCategory)

router.put('/category/delete-subcategory/:id', categoryCtrl.deleteSubcategory);

module.exports = router

