import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Checkbox, Label, Spinner, TextInput } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import Oauth from './Oauth';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export default function SignIn() {

  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.user)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return;
      }
      dispatch(signInSuccess(data));
      if (res.ok) {
        iziToast.success({
          title: 'Success',
          message: "<strong>Signed in successfully</strong>",
          position: 'topRight',
          timeout: 2000
        });
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  const handleShow = () => {
    const show = document.getElementById('password');
    if (show.type === 'password') {
      show.type = 'text' ;
    } else {
      show.type = 'password' ;
    }
  }

  return (
    <div className='min-h-screen mt-10 sm:mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6">
        {/* left side */}
        <div className="flex-1">
          <Link to='/' className='font-bold dark:text-white text-3xl sm:text-4xl'>
                <span className='px-2 py-1 bg-gradient-to-br from-green-400 to-cyan-600 rounded-lg text-white'>JoyBoy's</span>Blog
          </Link>
          <p className='text-sm mt-5'>
            This is my blog project. You can sign in with your username and password or with Google
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
            <div>
              <Label value='Your username' />
              <TextInput type='text' placeholder='username' id='username' onChange={handleChange}/>
            </div>
            <div>
              <Label value='Your password' />
              <TextInput type='password' placeholder='**********' id='password' onChange={handleChange}/>
            </div>
            <div className='flex gap-2 items-center'>
              <Checkbox onClick={handleShow} id='show'/>
              <Label htmlFor="show" className='cursor-pointer'>Show password</Label>
            </div>
            <Button gradientDuoTone='greenToBlue' type='submit' className='uppercase' disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>Loading...</span>
                </> 
              ) : 'Sign In'
              }
            </Button>
            <Oauth />
          </form>
          <div className="flex gap-2 mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className='text-blue-500 font-semibold hover:underline'>Sign Up</Link>
            </div>
            {error && (
              <Alert className='mt-5' color='failure'>{error}</Alert>
            )}
        </div>

      </div>
    </div>
  )
}
