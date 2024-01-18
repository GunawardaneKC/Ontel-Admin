const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
// const auth = require('../middleware/auth')

router.post('/register', userCtrl.register)

router.post('/login', userCtrl.login)

// router.get('/logout', userCtrl.logout)

// router.post('/refresh_token', userCtrl.refreshToken)

router.get('/infor',  userCtrl.getUser)

router.get('/users',  userCtrl.getAllUsers)

router.patch('/addcart', userCtrl.addCart)

router.get('/history', userCtrl.history)

router.get('/Allusers', (req, res) => {
    postEmp.find().exec((err, postEmp) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        return res.status(200).json({
            success: true,
            existingPosts: postEmp
        });

    });
});


module.exports = router