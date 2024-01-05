const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    // product_id:{
    //     type: String,
    //     unique: true,
    //     trim: true,
    //     required: true
    // },
    title:{
        type: String,
        trim: true,
        required: true
    },
    price:{
        type: Number,
        trim: true,
        required: true
    },
    description:{
        type: String,
        default: ''
    },
    stock:{
        type: String,
        default: ''
    },
    content:{
        type: String,
        required: true
    },
    colors:{
        type: String,
        default: ''
    },
    images:{
        type: Object,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    subcategory: {
        type: String, // You can change this to an array if a product can belong to multiple subcategories
        default: ''
    },
    checked:{
        type: Boolean,
        default: false
    },
}, {
    timestamps: true //important
})


module.exports = mongoose.model("Products", productSchema)