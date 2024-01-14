import React, {createContext, useState, useEffect} from 'react'
import ProductsAPI from './api/ProductsAPI'
import UserAPI from './api/UserAPI'
import CategoriesAPI from './api/CategoriesAPI'

import axios from 'axios'

export const GlobalState = createContext()


export const DataProvider = ({children}) =>{
    // axios.defaults.baseURL = 'http://20.2.85.43:5000';
    axios.defaults.baseURL = 'https://onetel-admin.onrender.com';  
    const [token, setToken] = useState(false)


    useEffect(() =>{
        const firstLogin = localStorage.getItem('firstLogin')
        if(firstLogin){
            // const refreshToken = async () =>{
            //     const res = await axios.get('/user/refresh_token')
        
            //     setToken(res.data.accesstoken)
    
            //     setTimeout(() => {
            //         refreshToken()
            //     }, 10 * 60 * 1000)
            // }
            const refreshToken = async () => {
              try {
                console.log('Token:', token);
                const res = await axios.get('/user/refresh_token', {
                  headers: {
                    Authorization: `${token}`
                  }
                });
                setToken(res.data.accesstoken);
                setTimeout(() => {
                  refreshToken();
                }, 10 * 60 * 1000);
              } catch (error) {
                console.error('Error refreshing token:', error);
                if (error.response) {
                  console.error('Error response data:', error.response.data);
                  console.error('Error response status:', error.response.status);
                  console.error('Error response headers:', error.response.headers);
                }
              }
            };
            refreshToken()
        }
    },[])


    
    const state = {
        token: [token, setToken],
        productsAPI: ProductsAPI(),
        userAPI: UserAPI(token),
        categoriesAPI: CategoriesAPI()
    }

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}