import { Button, Modal, Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiArrowSmRight, HiOutlineExclamationCircle, HiUser } from 'react-icons/hi'
import { TiDeleteOutline } from "react-icons/ti";
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteFailure, deleteStart, deleteSuccess } from '../redux/user/userSlice';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


export default function DashSidebar() {

    const location = useLocation();
    const [tab, setTab] = useState('');
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [showModel, setShowModel] = useState(false);
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if ( tabFromUrl ) {
            setTab(tabFromUrl);
        }
    }, [location.search])


    const handleDeleteAccount = async () => {
        setShowModel(false);
        try {
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
            
        } catch (error) {
            dispatch(deleteFailure(error.message))
        }
    }

  return (
    <>
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to={'/dashboard?tab=profile'}>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"User"} labelColor='dark' as={'div'}>
                        Profile 
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item  icon={TiDeleteOutline} className="cursor-pointer" onClick={()=>setShowModel(true)}>
                    Delete account 
                    </Sidebar.Item>
                    <Sidebar.Item  icon={HiArrowSmRight} className='cursor-pointer'>
                    Sign out 
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>

        <Modal show={showModel} onClose={() => setShowModel(false)} popup size='md'>
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h2 className='mb-5 text-3xl text-gray-500 dark:text-gray-400'>Are you Sure?</h2>
                    <p className='mb-5 text-lg text-gray-500 dark:text-gray-400'>You want to delete your account!</p>
                    <div className='flex justify-center gap-5'>
                        <Button color='failure' onClick={handleDeleteAccount}>Yes, I'm sure</Button>
                        <Button onClick={()=>setShowModel(false)} color='blue'>No, Cancel!</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </>
  )
}
