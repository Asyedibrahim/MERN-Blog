import { Button, Modal, Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { TiDeleteOutline } from "react-icons/ti";
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteFailure, deleteStart, deleteSuccess, signOutSuccess } from '../redux/user/userSlice';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import Swal from 'sweetalert2';


export default function DashSidebar() {

    const location = useLocation();
    const [tab, setTab] = useState('');
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if ( tabFromUrl ) {
            setTab(tabFromUrl);
        }
    }, [location.search])


    const handleDeleteAccount = async () => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Your account will be deleted!',
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel !'
              });
          
            if (result.isConfirmed) {
                dispatch(deleteStart())
                const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                    method:'DELETE'
                });
                const data = await res.json();
                if (!res.ok) {
                    dispatch(deleteFailure(data.message))
                } else {
                    dispatch(deleteSuccess(data));
                    iziToast.success({
                        title: 'Success',
                        message: "<strong>User has been deleted!</strong>",
                        position: 'topRight',
                        timeout: 1500,
                        pauseOnHover: false
                    });
                }
            }
        } catch (error) {
            dispatch(deleteFailure(error.message))
        }
    };

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
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to={'/dashboard?tab=profile'}>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as={'div'}>
                    Profile 
                    </Sidebar.Item>
                </Link>
                {currentUser && currentUser.isAdmin && (
                    <Link to='/dashboard?tab=dash'>
                    <Sidebar.Item
                        active={tab === 'dash'}
                        icon={HiChartPie}
                        as='div'>Dashboard
                    </Sidebar.Item>
                    </Link>
                )}
                {currentUser.isAdmin && (
                    <>
                    <Link to={'/dashboard?tab=posts'}>
                        <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as={'div'}>
                        Posts 
                        </Sidebar.Item>
                    </Link>
                    <Link to={'/dashboard?tab=users'}>
                        <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} as={'div'}>
                        Users 
                        </Sidebar.Item>
                    </Link>
                    <Link to={'/dashboard?tab=comments'}>
                        <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} as={'div'}>
                        Comments 
                        </Sidebar.Item>
                    </Link>
                    </>
                )}

                <Sidebar.Item  icon={TiDeleteOutline} className="cursor-pointer" onClick={handleDeleteAccount}>
                Delete account 
                </Sidebar.Item>

                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
                Sign out 
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
