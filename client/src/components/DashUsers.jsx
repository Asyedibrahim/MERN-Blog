import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'flowbite-react';
import Swal from 'sweetalert2';
import { FaCheck, FaTimes} from 'react-icons/fa'


export default function DashUsers() {

  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);


  
  useEffect(()=> {
    window.scrollTo(0, 0);
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers');
        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setUsers(data.users);
          if (data.users.length < 9){
            setShowMore(false)
          }
        }
        
      } catch (error) {
        console.log(error.message);
      }
    }
    if (currentUser.isAdmin) {
      fetchUsers();
    }

  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
      {loading ? <p className='text-3xl my-52 text-center'>Loading...</p> : 
      currentUser.isAdmin && users.length > 0 && !loading ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>user image</Table.HeadCell>
              <Table.HeadCell>username</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>admin</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' >

                  <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>

                  <Table.Cell>
                    <img src={user.avatar} alt={user.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                  </Table.Cell>

                  <Table.Cell>{user.username}</Table.Cell>

                  <Table.Cell>{user.email}</Table.Cell>

                  <Table.Cell>{user.isAdmin ? (<FaCheck className='text-green-500'/>) : (<FaTimes className='text-red-500'/>)}</Table.Cell>

                  <Table.Cell>
                    <span className='text-red-500 font-medium hover:underline cursor-pointer' >Delete</span>
                  </Table.Cell>

                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7 hover:underline'>Show more</button>
          )}
        </>
      ) : (
        <p>You have no user yet!</p>
      )}
    </div>
  )
}
