import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spinner, Table } from 'flowbite-react';
import Swal from 'sweetalert2';


export default function DashComment() {

  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);


  
  useEffect(()=> {
    window.scrollTo(0, 0);
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getAllComments');
        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setComments(data.comments);
          if (data.comments.length < 9){
            setShowMore(false)
          }
        }
        
      } catch (error) {
        console.log(error.message);
      }
    }
    if (currentUser.isAdmin) {
      fetchComments();
    }

  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You cannot retrive this comment!',
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel !',
      });
  
      if (result.isConfirmed) {
        const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (res.ok) {
          setComments((prev) => prev.filter((comment) => comment._id !== commentId));
        } else {
          console.log(data.message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
      {loading ? <p className='text-3xl my-52 justify-center flex items-center gap-2'>Loading...<Spinner size='lg'/></p> : 
      currentUser.isAdmin && comments.length > 0 && !loading ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>comment content</Table.HeadCell>
              <Table.HeadCell>number of likes</Table.HeadCell>
              <Table.HeadCell>postid</Table.HeadCell>
              <Table.HeadCell>userid</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className='divide-y' key={comment._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' >

                  <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>

                  <Table.Cell>
                    {comment.content}
                  </Table.Cell>

                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>

                  <Table.Cell>{comment.postId}</Table.Cell>

                  <Table.Cell>{comment.userId}</Table.Cell>

                  <Table.Cell>
                    <span className='text-red-500 font-medium hover:underline cursor-pointer' onClick={() => handleDeleteComment(comment._id)}>Delete</span>
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
        <p>You have no comment yet!</p>
      )}
    </div>
  )
}
