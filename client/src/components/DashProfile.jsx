import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { app } from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {

    const { currentUser } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const fileRef = useRef();
    const [uploadProgress, setUploadProgress] = useState(null);
    const [imageError, setImageError] = useState(null);


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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-5'>

          <input type="file" accept='image/*' onChange={handleImageChange} ref={fileRef} hidden/>

            <div className="relative w-28 h-28 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => fileRef.current.click()}>
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

              {imageError && <Alert color='failure'>{imageError}</Alert> }
            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}/>
            <TextInput type='email' id='email' placeholder='name@gmail.com' defaultValue={currentUser.email}/>
            <TextInput type='password' id='password' placeholder='password'/>
            <Button type='submit' gradientDuoTone='greenToBlue' outline className='uppercase'>Update</Button>
        </form>
    </div>
  )
}
