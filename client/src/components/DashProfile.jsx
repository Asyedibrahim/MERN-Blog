import { Alert, Button, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { Link } from 'react-router-dom'
import { app } from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice.js';
import { FaEdit } from 'react-icons/fa'
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';


export default function DashProfile() {

    const { currentUser } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const fileRef = useRef();
    const [uploadProgress, setUploadProgress] = useState(null);
    const [imageError, setImageError] = useState(null);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);


    // allow read;
    // allow write: if
    // request.resource.size < 2 * 1024 * 1024 &&
    // request.resource.contentType.matches('image/.*');

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      }
    };

    useEffect(() => {
      if (imageFile) {
        uploadImage();
      }
    }, [imageFile]);

    const uploadImage = async () => {
      setImageError(null);
      setImageLoading(true);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      }, 
      (error) => {
        setImageError('Could not upload image (File must be less than 2MB)');
        setUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, avatar: downloadURL});
          setImageLoading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (Object.keys(formData).length === 0) {
      setError('No changes made');
      setLoading(false);
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setError(data.message);
        setLoading(false);
      } else {
        dispatch(updateSuccess(data));
        iziToast.success({
          title: 'Success',
          message: "<strong>User's profile updated successfully</strong>",
          position: 'topRight',
          timeout: 3000
        });
        setUploadProgress(null);
        setLoading(false);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-5' onSubmit={handleSubmit}>

          <input type="file" accept='image/*' onChange={handleImageChange} ref={fileRef} hidden/>

          <div className='self-center flex items-end'>
            <div className="relative w-28 h-28 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => fileRef.current.click()} onChange={handleChange}>
                {uploadProgress && (
                  <CircularProgressbar value={uploadProgress || 0} text={`${uploadProgress}%`} strokeWidth={6} 
                  styles={{ 
                    root: {
                      width: '100%', 
                      height: '100%', 
                      position: 'absolute', 
                      top: 0, 
                      left: 0
                    }, 
                    path: {
                      stroke: 'rgba(62, 152, 199)',
                    },
                  }} />
                )};
                <img src={imageFileUrl || currentUser.avatar} alt="" className={`rounded-full w-full h-full object-cover border-[lightgray] mt-[-24px] ${uploadProgress && uploadProgress < 100 && 'opacity-30'}`} /> 
            </div>
              <FaEdit className='-ml-2 cursor-pointer' onClick={()=>fileRef.current.click()}/>
          </div>

              {imageError && <Alert color='failure'>{imageError}</Alert> }
            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
            <TextInput type='email' id='email' placeholder='name@gmail.com' defaultValue={currentUser.email} onChange={handleChange}/>
            <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
            <Button type='submit' gradientDuoTone='greenToBlue' outline className='uppercase' disabled={loading || imageLoading}>
            {loading ? (
                <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>Updating...</span>
                </> 
              ) : 'update'
              }
            </Button>
            {currentUser.isAdmin && (
            <Link to={'/create-post'}>
              <Button type='button' gradientMonochrome='teal' className='w-full uppercase'>Create a post</Button>
            </Link>
            )}
        </form>
        {error && <Alert color={'failure'} className='mt-5'>{error}</Alert>}
    </div>
  )
}
