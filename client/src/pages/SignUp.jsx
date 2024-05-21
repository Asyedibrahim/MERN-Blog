import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Label, TextInput } from 'flowbite-react'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-10 sm:mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6">
        {/* left side */}
        <div className="flex-1">
          <Link to='/' className='font-bold dark:text-white text-3xl sm:text-4xl'>
                <span className='px-2 py-1 bg-gradient-to-br from-green-400 to-cyan-600 rounded-lg text-white'>JoyBoy's</span>Blog
          </Link>
          <p className='text-sm mt-5'>
            This is my blog project. You can sign up with your email and password or with Google
          </p>
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4 ">
            <div>
              <Label value='Your username' />
              <TextInput type='text' placeholder='Username' id='username' />
            </div>
            <div>
              <Label value='Your email' />
              <TextInput type='text' placeholder='name@company.com' id='email' />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput type='password' placeholder='Password' id='password' />
            </div>
            <div>
              <Label value='Confirm your Password' />
              <TextInput type='password' placeholder='Confirm password' id='confirm_pass' />
            </div>
            <Button gradientDuoTone='greenToBlue' type='submit' className='uppercase'>Sign Up</Button>
          </form>
          <div className="flex gap-2 mt-5">
            <span>Already have an account?</span>
            <Link to="/sign-in" className='text-blue-500 font-semibold hover:underline'>Sign In</Link>
            </div>
        </div>

      </div>
    </div>
  )
}
