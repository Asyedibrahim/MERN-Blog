import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard'

export default function () {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/post/getposts');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    fetchPost();
  }, [])

  return (
    <div className=''>
      <div className="flex flex-col gap-6 p-28 px-4 max-w-6xl mx-auto">
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500'>Here you'll find your ultimate source for anime news, reviews, and recommendations!</p>
        <Link to='/search' className='text-teal-500 font-bold hover:underline text-sm'>View all post</Link>
      </div>

      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post}/>
              ))}
            </div>
            <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center font-semibold'>View all posts</Link>
          </div>
        )}
      </div>
    </div>
  )
}
