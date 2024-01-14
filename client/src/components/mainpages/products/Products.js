import React, {useContext, useState} from 'react';
import {GlobalState} from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import Loading from '../utils/loading/Loading';
import axios from 'axios';
import Filters from './Filters';
import LoadMore from './LoadMore';
import {motion} from 'framer-motion';
import {fadeIn} from '../../../variants';


function Products() {
    // axios.defaults.baseURL = 'http://20.2.85.43:5000';
    axios.defaults.baseURL = 'https://onetel-admin.onrender.com';  
    const state = useContext(GlobalState)
    const [products, setProducts] = state.productsAPI.products
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [callback, setCallback] = state.productsAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)

    const handleCheck = (id) =>{
        products.forEach(product => {
            if(product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const deleteProduct = async(id, public_id) => {
        try {
            setLoading(true)
            const destroyImg = axios.post('/api/destroy', {public_id},{
                headers: {Authorization: token}
            })
            const deleteProduct = axios.delete(`/api/products/${id}`, {
                headers: {Authorization: token}
            })

            await destroyImg
            await deleteProduct
            setCallback(!callback)
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const deleteAll = () =>{
        products.forEach(product => {
            if(product.checked) deleteProduct(product._id, product.images.public_id)
        })
    }

    if(loading) return <div><Loading /></div>
    return (
        
        <>
        <div  className='container flex items-center justify-center ml-44'>
        <div className="admin"> 
    </div>
       </div>
        <Filters /> 

        {
            isAdmin && 
            <div className="delete-all">
                <button onClick={deleteAll}>Delete Selected</button>
            </div>
        }

        <motion.div variants={fadeIn('left', 0.6)} initial="hidden" whileInView={'show'} className="products" id='productsId1'>
            {
                products.map(product => {
                    
                    return ( <ProductItem key={product._id} product={product}
                    isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck} />
                    )
                })
            } 
        </motion.div>

        <LoadMore />
        {products.length === 0 && <Loading />}
        </>
    )
}

export default Products
