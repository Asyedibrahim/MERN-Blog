import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';


export default function CreatePost() {

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  
  const handleImageUpload = async () => {
    try {
      if (!file) {
        setUploadError('Please select an image');
        return;
      }
      setUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      }, 
      (error) => {
        setUploadError('Image upload failed');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadProgress(null);
          setUploadError(null);
          setFormData({...formData, image: downloadURL});
        });
      }
    );

    } catch (error) {
      setUploadError('Image upload failed');
      setUploadProgress(null);
      console.log(error);
    }
  }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>

      <form className='flex flex-col gap-4'>

          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput type='text' placeholder='Title' required id='title' className='flex-1'/>
            <Select>
              <option value="uncategorized">Select a category</option>
              <option value="shonen">Shonen</option>
              <option value="adventure">Adventure</option>
              <option value="sports">Sports</option>
              <option value="horror">Horror</option>
            </Select>
          </div>

          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])}/>
            <Button gradientDuoTone='greenToBlue' size='sm' type='button' outline onClick={handleImageUpload} disabled={uploadProgress}>
              {uploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar value={uploadProgress} text={`${uploadProgress || 0}%`} />
              </div>
              ) : ('Upload Image')
              }
            </Button>
          </div>

          {uploadError && <Alert color='failure'>{uploadError}</Alert> }
          {formData.image && (
            <img src={formData.image} alt='uploaded image' className='w-full h-72 object-cover'/>
          )}

          <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required/>
          <Button type='submit' gradientMonochrome="teal" className='uppercase mb-12'>publish</Button>

      </form>
    </div>
  )
}
