import { Button, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux'

export default function DashProfile() {

    const { currentUser } = useSelector(state => state.user);

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl uppercase'>Profile</h1>
        <form className='flex flex-col gap-5'>
            <div className="w-24 h-24 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                <img src={currentUser.avatar} alt="" className='rounded-full w-full h-full border-8 object-cover border-[lightgray]'/>
            </div>
            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}/>
            <TextInput type='email' id='email' placeholder='name@gmail.com' defaultValue={currentUser.email}/>
            <TextInput type='password' id='password' placeholder='password'/>
            <Button type='submit' gradientDuoTone='greenToBlue' outline className='uppercase'>Update</Button>
        </form>
    </div>
  )
}
