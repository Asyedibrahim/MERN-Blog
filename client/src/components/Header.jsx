import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import { useSelector } from 'react-redux'

export default function Header() {

    const path = useLocation().pathname;
    const { currentUser } = useSelector(state => state.user);

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
                <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.avatar} rounded/>}>
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
                    <Dropdown.Item>
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
            <Navbar.Link className='flex gap-1 cursor-pointer'>
                <FaMoon className='mt-1'/>
                <span className='md:hidden'>Dark Mode</span>
            </Navbar.Link>
        </Navbar.Collapse>

    </Navbar>
  )
}
