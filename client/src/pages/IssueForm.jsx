import { APILoader, PlacePicker } from '@googlemaps/extended-component-library/react';
import { Gemini } from '../helper/api.js';
import { SwalSuccess, SwalError } from '../helper/swal.js';
import '../styles/IssueForm.css';
import { auth, storage } from '../components/firebase.jsx';
import { useEffect, useState } from 'react';
import '../styles/IssueForm.css';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loader from '../components/loader.jsx';

const IssueForm = () => {
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [severity, setSeverity] = useState('');
  const GOOGLE_API = import.meta.env.VITE_GOOGLE_API;
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const usingSwal = () => {
      withReactContent(Swal).fire({
        icon: "error",
        title: "User Not Logged In",
        text: "Please sign in to view Issue Form",
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Log In',
        cancelButtonText: 'Close',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        } else {
          navigate('/');
        }
      })
    };
    auth.onAuthStateChanged((user) => {
      if (!user) {
        usingSwal();
      }else{
        setLoggedIn(true);
      }
    });
  },[navigate]);

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handlePlaceChange = (e) => {
    setLocation(e.target.value?.formattedAddress ?? '');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && isFileTypeValid(file.type)) {
      setPhoto(file);
      console.log("valid");
    } else {
      alert('Invalid file type. Please select an image (PNG, JPEG, WEBP, HEIC, HEIF).');
    }
  };
  
  const isFileTypeValid = (fileType) => {
    return /^image\/(png|jpeg|webp|heic|heif)$/.test(fileType);
  };

  const handleTagsChange = (e) => {
    const value = e.target.value.trim();
    if (e.key === ' ' && value) {
      setTags([...tags, value]);
      setCustomTag('');
    }
  };

  const handleCustomTagChange = (e) => {
    setCustomTag(e.target.value);
  };

  const handleTagDelete = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  const handleSeverityChange = (e) => {
    setSeverity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!location) {
    //   toast.error('Location is required.', {
    //   position: "bottom-center",
    // }); return; }

    if (!photo) {
      toast.error('Photo is required.', {
      position: "bottom-center",
    }); return;}

    if (tags.length === 0) {
      toast.error('At least one tag is required.', {
      position: "bottom-center",
    }); return;}

    if (!severity) {
      toast.error('Severity is required.', {
      position: "bottom-center",
    }); return;}
    setIsLoading(true);
    const user = auth.currentUser;
    const formData = new FormData();
    const date = Date.now();
    const name = `images/${user.uid}${date}${photo.name}`
    const storageRef = ref(storage,name);


    formData.append('user',user.uid);
    formData.append('location', location);
    formData.append('photo', photo);
    formData.append('tags', tags);
    formData.append('severity', severity);
    formData.append('date', getCurrentDate());

    try {
      await uploadBytes(storageRef, photo);
      const downloadURL = await getDownloadURL(storageRef);
      formData.append('photoUrl', downloadURL);
      const result = await Gemini(formData);
      console.log('Success:', result);
      SwalSuccess();
    } catch (error) {
      console.error('Error:', error);
      SwalError();
    }
    setIsLoading(false);
    setLocation('');
    setPhoto(null);
    setTags([]);
    setCustomTag('');
    setSeverity('');
  };

  return (
    <>
    {isLoading && <Loader/>}
    { loggedIn && <div className="container">
      <h1>Report an Issue</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <APILoader apiKey={GOOGLE_API} solutionChannel="GMP_GCC_placepicker_v1" />
          <PlacePicker
            className="form-control place-picker"
            id="location"
            placeholder="Enter a place to report"
            onPlaceChange={handlePlaceChange}
            // required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">Upload Photo</label>
          <input type="file" className="form-control" id="photo" accept="image/png, image/jpeg, image/webp, image/heic, image/heif" onChange={handlePhotoChange} 
          // required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags</label>
          <input type="text" className="form-control" id="tags" placeholder="Enter tags"
            value={customTag} onChange={handleCustomTagChange} onKeyDown={handleTagsChange} />
          <small className="form-text text-muted">Separate tags with spaces.</small>
          <div>
            {tags.map((tag, index) => (
              <span key={index} className="badge bg-primary text-light mr-1 issue-form-tags">
                {tag}
                <button type="button" className="btn-close ms-1" aria-label="Close"
                  onClick={() => handleTagDelete(index)}></button>
              </span>
            ))}
          </div>
          {tags.length === 0 && <div className="text-danger">At least one tag is required.</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="severity" className="form-label">Severity</label>
          <select className="form-select" id="severity" value={severity} onChange={handleSeverityChange} 
          // required
          >
            <option value="">Select severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>}</>
  );
};

export default IssueForm;