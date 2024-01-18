import {useState, useEffect} from 'react'
import axios from 'axios'

function UserAPI(token) {
    axios.defaults.baseURL = 'https://onetel-admin.onrender.com';
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isUser, setIsUser] = useState(false)
    const [cart, setCart] = useState([])
    const [history, setHistory] = useState([])

    useEffect(() => {
        const getUser = async () => {
            try {
                if (token) {
                    const res = await axios.get('/user/infor', {
                        // headers: { Authorization: token },
                    });
    
                    setIsLogged(true);
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
                    res.data.role === 0 ? setIsUser(true) : setIsUser(false);
    
                    setCart(res.data.cart);
                } else {
                    // Handle the case when there's no token
                    setIsLogged(true);
                    setIsAdmin(true);
                    setIsUser(false);
                    setCart([]);
                }
            } catch (err) {
                alert(err.response.data.msg);
            }
        };
    
        getUser();
    }, [token]);

    

    const addCart = async (product) => {
        if(!isLogged) return alert("Please login to continue buying")

        const check = cart.every(item =>{
            return item._id !== product._id
        })

        if(check){
            setCart([...cart, {...product, quantity: 1}])

            await axios.patch('/user/addcart', {cart: [...cart, {...product, quantity: 1}]}, {
                headers: {Authorization: token}
            })

        }else{
            alert("This product has been added to cart.")
        }
    }

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        isUser: [isUser, setIsUser],
        cart: [cart, setCart],
        addCart: addCart,
        history: [history, setHistory]
    }
}

export default UserAPI
 