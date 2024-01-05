import React, {useContext} from 'react';
import {Routes, Route,} from 'react-router-dom';
import Products from './products/Products';
// import DetailProduct from './detailProduct/DetailProduct';
import Login from './auth/Login';
import Register from './auth/Register';
import NotFound from './utils/not_found/NotFound';
import Categories from './categories/Categories';
import CreateProduct from './createProduct/CreateProduct';
import {GlobalState} from '../../GlobalState';

function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin


    return (
        <Routes>
            <Route path="/" exact element={<Login/>} />
            <Route path="/products" exact element={isAdmin ? <Products/> : <NotFound/>} />
            {/* <Route path="/detail/:id" exact element={<DetailProduct/>} /> */}
            {/* <Route path="/ProR" exact element={<ReportPro/>} /> */}

            {/* <Route path="/supportChat" exact element={<SupportChat/>} /> */}

             {/* <Route path="/login" exact element={isLogged ? <NotFound/> : <Login/>} /> */}
            <Route path="/register" exact element={isLogged ? <NotFound/> : <Register/>} /> 
            
            {/* <Route path="/dashBoard" exact element={isAdmin ? <DashBoard/> : <NotFound/>} /> */}

            <Route path="/category" exact element={isAdmin ? <Categories/> : <NotFound/>} />
            <Route path="/create_product" exact element={isAdmin ? <CreateProduct/> : <NotFound/>} />
            <Route path="/edit_product/:id" exact element={isAdmin ? <CreateProduct/> : <NotFound/>} />

            <Route path="*" exact element={<NotFound/>} />

        </Routes>
        
    )
}

export default Pages
