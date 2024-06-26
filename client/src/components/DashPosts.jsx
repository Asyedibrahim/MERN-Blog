import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spinner, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function DashPosts() {

  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);


  
  useEffect(()=> {
    window.scrollTo(0, 0);
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setUserPosts(data.posts);
          if (data.posts.length < 9){
            setShowMore(false)
          }
        }
        
      } catch (error) {
        console.log(error.message);
      }
    }
    if (currentUser.isAdmin) {
      fetchPost();
    }

  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const handleDeletePost = async (postId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You cannot retrive this post!',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel !',
      });
  
      if (result.isConfirmed) {
        const res = await fetch(`/api/post/deletepost/${postId}/${currentUser._id}`, {
            method: 'DELETE',
          });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          setUserPosts((prev) => prev.filter((post) => post._id !== postId)
          );
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
      {loading ? <p className='text-3xl my-52 justify-center flex gap-2 items-center'>Loading...<Spinner size='lg'/></p> : 
      currentUser.isAdmin && userPosts.length > 0 && !loading ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className='divide-y' key={post._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' >
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span className='text-red-500 font-medium hover:underline cursor-pointer' 
                    onClick={() => handleDeletePost(post._id)}>Delete</span>
                  </Table.Cell>
                  <Table.Cell className='text-teal-500 font-medium hover:underline'>
                    <Link to={`/update-post/${post._id}`}>Edit</Link>
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
        <p>You have no post yet!</p>
      )}
    </div>
  )
}
