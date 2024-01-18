const router = require('express').Router()
const { connect } = require('mongoose')
const productCtrl = require('../controllers/productCtrl')
// const auth = require('../middleware/auth')
// const authAdmin = require('../middleware/authAdmin')
const postPay = require('../models/productModel')

router.route('/products')
    .get(productCtrl.getProducts)
    .post(productCtrl.createProduct)


router.route('/products/:id')
    .delete(productCtrl.deleteProduct)
    .put(productCtrl.updateProduct)

    router.get('/product', (req, res) => {
        postPay.find().exec((err, postPay) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                existingPosts: postPay
            });
    
        });
    });

module.exports = router