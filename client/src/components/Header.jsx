import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toogleTheme } from '../redux/theme/themeSlice';
import Swal from 'sweetalert2';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { signOutSuccess } from '../redux/user/userSlice';

export default function Header() {

    const path = useLocation().pathname;
    const { currentUser } = useSelector(state => state.user);
    const { theme } = useSelector(state => state.theme);
    const dispatch = useDispatch();

    const handleSignout = async () => {
        try {
            const result = await Swal.fire({
                title: 'Are you want to sign out?',
                text: 'You will be logged out of your account!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sign out!',
                cancelButtonText: 'Cancel!'
              });
              if (result.isConfirmed) {
                const res = await fetch('/api/auth/signout');
                const data = await res.json();
                if (res.ok) {
                    iziToast.success({
                        title: 'Success',
                        message: "<strong>Signed out Successfully!</strong>",
                        position: 'topRight',
                        timeout: 1500,
                        pauseOnHover: false
                    });
                    dispatch(signOutSuccess(data));
                } else {
                    console.log(data.message);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

  return (
    <Navbar className='border-b-2'>
        <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-br from-green-400 to-cyan-600 rounded-lg text-white'>JoyBoy's</span>Blog
        </Link>
        <form>
            <TextInput 
                type='text' placeholder='Search...'
                rightIcon={AiOutlineSearch}
                className='hidden lg:inline'
            />
        </form>
        <Button className='w-10 sm:w-12 h-10 lg:hidden' color='gray' pill>
            <AiOutlineSearch />
        </Button>

        <div className="flex gap-2 md:order-2">
            {currentUser ? (
                <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.avatar} rounded />}>
                    <Dropdown.Header>
                        <span className='block text-sm'>{currentUser.username}</span>
                        <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>
                            Profile
                        </Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleSignout}>
                        Sign out
                    </Dropdown.Item>
                </Dropdown>
            ) : (
                <Link to='/sign-in' className='w-13'>
                    <Button outline gradientDuoTone='greenToBlue'>Sign in</Button>
                </Link>
            )}
            <Navbar.Toggle/>
        </div>
        <Navbar.Collapse>
            <Link to='/'>
                <Navbar.Link active={path === '/'} as={'div'}>
                    Home
                </Navbar.Link>
            </Link>
            <Link to='/about'>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    About
                </Navbar.Link>
            </Link>
            <Link to='/projects'>
                <Navbar.Link active={path === '/projects'} as={'div'}>
                    Projects
                </Navbar.Link>
            </Link>
            <Navbar.Link className='flex gap-1 cursor-pointer' onClick={() => dispatch(toogleTheme())}>
                { theme === 'dark' ?  <FaSun className='mt-1'/> : <FaMoon className='mt-1'/> }
                { theme === 'dark' ?  <span className='md:hidden'>Light Mode</span> : <span className='md:hidden'>Dark Mode</span> }
                
            </Navbar.Link>
        </Navbar.Collapse>

    </Navbar>
  )
}
