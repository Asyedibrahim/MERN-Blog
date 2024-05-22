import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase.js'
import { useDispatch } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice.js'
import { useNavigate } from 'react-router-dom'

export default function Oauth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogle = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' })
        const result = await signInWithPopup(auth, provider);

        try {
            dispatch(signInStart());
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: result.user.displayName,
                    email: result.user.email,
                    avatar: result.user.photoURL
                })
            });
            const data = await res.json();
            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    }

  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogle}>
         <span className='uppercase flex items-center'><AiFillGoogleCircle className='w-5 h-5 mr-2'/>Continue with Google</span>
    </Button>
  )
}
