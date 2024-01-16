import React, {createContext, useState, useEffect} from 'react'
import ProductsAPI from './api/ProductsAPI'
import UserAPI from './api/UserAPI'
import CategoriesAPI from './api/CategoriesAPI'

import axios from 'axios'

export const GlobalState = createContext()


export const DataProvider = ({children}) =>{
     
    axios.defaults.baseURL = 'https://onetel-admin.onrender.com';
    const [token, setToken] = useState(false)


    useEffect(() =>{
        const firstLogin = localStorage.getItem('firstLogin')
        const refreshtoken = localStorage.getItem('refreshtoken');
        console.log(refreshtoken)
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
                const res = await axios.post(
                  '/user/refresh_token',
                  {},
                  {
                    headers: {
                      Authorization: `${refreshtoken}`
                    }
                  }
                );
                  setToken(res.data.accesstoken);
                  setTimeout(() => {
                    refreshToken();
                  }, 10 * 60 * 1000);
                } catch (error) {
                  console.error('Error refreshing token:', error);
                  // Log additional details about the error response
                  if (error.response) {
                    console.error('Error response data:', error.response.data);
                    console.error('Error response status:', error.response.status);
                    console.error('Error response headers:', error.response.headers);
                  }
                  // Handle the error appropriately (e.g., redirect to login page)
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