import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {FaUserShield} from 'react-icons/fa';
import {BsFillShieldLockFill} from 'react-icons/bs';
import video from '../../../images/polygon-145031.mp4';
import { useNavigate } from 'react-router-dom';

function Login() {

    axios.defaults.baseURL = 'https://onetel-admin.onrender.com';
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email:'', password: ''
    })

    const onChangeInput = e =>{
        const {name, value} = e.target;
        setUser({...user, [name]:value})
    }

    const loginSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/user/login', {...user});
            if (res.data && res.data.refreshtoken) {
                localStorage.setItem('firstLogin', true);
                localStorage.setItem('refreshtoken', res.data.refreshtoken);
                navigate('/products');
            } else {
                alert('No refresh token received');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                alert(err.response.data.msg);
            } else {
                alert('An error occurred while logging in');
            }
        }
    };

    return (
        <div className='loginPageLR flexLR'>
        <div className="containerLR w-80 sm:w-75 h-60vh mx-auto flex justify-between rounded-md bg-gradient-to-r from-cyan-400 to-pink-500">
            
            <div className="formDiv flexLR">
            <div className=" text-center md:text-left p-4 md:p-6 mt-5" >
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">Welcome Back</h3>
            </div>

                <form noValidate onSubmit={loginSubmit} className='form grid' autoComplete='off'>
                    {/* <span className='showMessage'>Login Status will go here</span> */}

                    <div className="inputDiv">
                        <label htmlFor="email">Email:</label>
                        <div className="input flexLR">
                            <FaUserShield className='icon' />
                            <input type="text" id="email" name="email" placeholder="Enter Email" value={user.email} onChange={onChangeInput} />
                        </div>
                    </div>

                    <div className="inputDiv">
                        <label htmlFor="password">Password:</label>
                        <div className="input flexLR">
                            <BsFillShieldLockFill className='icon' />
                            <input type="password" id="password" name="password" placeholder="Enter Password" value={user.password} onChange={onChangeInput} />
                        </div>
                    </div>

                    <button type='submit' className='btn flexLR'>
                        <span className='font-secondary'>Login</span>
                        {/* <AiOutlineSwapRight className='icon' /> */}
                    </button>
                </form>
            </div>

        </div>
      </div>
    )
}

export default Login
