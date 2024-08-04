import { APILoader, PlacePicker } from '@googlemaps/extended-component-library/react';
import { Gemini } from '../helper/api.js';
import { SwalSuccess, SwalError } from '../helper/swal.js';
import '../styles/IssueForm.css';
import { auth, storage } from '../components/firebase.jsx';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loader from '../components/loader.jsx';
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

const IssueForm = () => {
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [photo, setPhoto] = useState(null);
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [severity, setSeverity] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const GOOGLE_API = import.meta.env.VITE_GOOGLE_PAID_API;
  const navigate = useNavigate();
  
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
      } else {
        setLoggedIn(true);
      }
    });
  }, [navigate]);

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
  };

  // const handlePlaceChange = (e) => {
  //   const formattedAddress = e.target.value?.formattedAddress ?? '';
  //   const latitude = e.target.value?.location?.lat ?? 0;
  //   const longitude = e.target.value?.location?.lng ?? 0;


  //   console.log('Formatted Address:', formattedAddress);
  //   console.log('Latitude:', latitude);
  //   console.log('Longitude:', longitude);
  //   // if (!place || !place) {
  //   //   console.error('Invalid place object:', place);
  //   //   return;
  //   // }
  //   // console.log(place);

  //   // const lat = place.geometry.location.lat();
  //   // const lng = place.geometry.location.lng();

  //   // let city = '';
  //   // let state = '';
  //   // let country = '';

  //   // for (const component of place.address_components) {
  //   //   if (component.types.includes('locality')) {
  //   //     city = component.long_name;
  //   //   }
  //   //   if (component.types.includes('administrative_area_level_1')) {
  //   //     state = component.long_name;
  //   //   }
  //   //   if (component.types.includes('country')) {
  //   //     country = component.long_name;
  //   //   }
  //   // }

  //   // setLocation(place.formatted_address || '');

  //   // console.log('Latitude:', lat);
  //   // console.log('Longitude:', lng);
  //   // console.log('City:', city);
  //   // console.log('State:', state);
  //   // console.log('Country:', country);

  //   // if (place) {
  //   //   const latitude = place.geometry.location.lat();
  //   //   const longitude = place.geometry.location.lng();
      
  //   //   console.log('Latitude:', latitude);
  //   //   console.log('Longitude:', longitude);
  
  //   //   // You can use the latitude and longitude here
  //   //   // For example, set them in the state if you're using React
  //   //   // setState({ latitude, longitude });
  //   // } else {
  //   //   console.error('Place does not have geometry or location data.');
  //   // }
  // };

  const handlePlaceChange = (e) => {
    // const formattedAddress = e.target.value?.formattedAddress ?? '';
  
    // // Check if latitude and longitude are functions, then call them
    // const latitude = typeof e.target.value?.location?.lat === 'function' 
    //   ? e.target.value.location.lat() 
    //   : e.target.value?.location?.lat ?? 0;
  
    // const longitude = typeof e.target.value?.location?.lng === 'function' 
    //   ? e.target.value.location.lng() 
    //   : e.target.value?.location?.lng ?? 0;
  
    // console.log('Formatted Address:', formattedAddress);
    // console.log('Latitude:', latitude);
    // console.log('Longitude:', longitude);

    const place = e.target.value;

  // Extract formatted address
  const formattedAddress = place?.formattedAddress ?? '';

  // Extract latitude and longitude
  const latitude = typeof place?.location?.lat === 'function' 
    ? place.location.lat() 
    : place?.location?.lat ?? 0;

  const longitude = typeof place?.location?.lng === 'function' 
    ? place.location.lng() 
    : place?.location?.lng ?? 0;

  // Log the values
  // get the city from the place
  // let city = '';
  // let state = '';
  // let country = '';
  // let postalCode = '';
  // let streetNumber = '';
  // let streetName = '';
  // let sublocality = '';
  // let sublocalityLevel1 = '';
  // let sublocalityLevel2 = '';
  // let sublocalityLevel3 = '';
  // let sublocalityLevel4 = '';
  // let sublocalityLevel5 = '';
  // let sublocalityLevel6 = '';
  // let sublocalityLevel7 = '';

  // now write the object call to retrive city

  // error saying TypeError: place.address_components is not iterable
  // correct it and write the correct code 
  // if (place.address_components) {
  //   console.log('Address Components:', place.address_components);
  // } else {
  //   console.error('Address Components not found.');
  // }
  
  // for (const component of place.address_components) {
  //   if (component.types.includes('locality')) {
  //     city = component.long_name;
  //   }
  //   if (component.types.includes('administrative_area_level_1')) {
  //     state = component.long_name;
  //   }
  //   if (component.types.includes('country')) {
  //     country = component.long_name;
  //   }
  //   if (component.types.includes('postal_code')) {
  //     postalCode = component.long_name;
  //   }
  // }
  // console.log('City:', city);
  // console.log('State:', state);
  // console.log('Country:', country);
  // console.log('Postal Code:', postalCode);


  

  setLocation(formattedAddress);
  setLat(latitude);
  setLng(longitude);

  console.log('Formatted Address:', formattedAddress);
  console.log('Latitude:', latitude);
  console.log('Longitude:', longitude);
  };
  
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && isFileTypeValid(file.type)) {
      setPhoto(file);
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

    if (!location) {
      toast.error('Location is required.', {
      position: "bottom-center",
    }); return; }

    if (!photo) {
      toast.error('Photo is required.', {
        position: "bottom-center",
      }); return;
    }

    if (tags.length === 0) {
      toast.error('At least one tag is required.', {
        position: "bottom-center",
      }); return;
    }

    if(tags.length > 4){
      toast.error('Maximum of 4 tags allowed.', {
        position: "bottom-center",
      }); return;
    }

    if (!severity) {
      toast.error('Severity is required.', {
        position: "bottom-center",
      }); return;
    }
    setIsLoading(true);
    const user = auth.currentUser;
    const formData = new FormData();
    const date = Date.now();
    const name = `images/${user.uid}/${date}${photo.name}`
    const storageRef = ref(storage, name);

    formData.append('user', user.uid);
    formData.append('location', location);
    formData.append('lat', lat);
    formData.append('lng', lng);
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
      {isLoading && <Loader />}
      {loggedIn && (
        <Box
          className="container"
          component="form"
          onSubmit={handleSubmit}
          sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3, width: { sm: 400, md: 500 } }}
        >
          <Typography variant="h4" gutterBottom>Report an Issue</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="location"></InputLabel>
            <APILoader apiKey={GOOGLE_API} solutionChannel="GMP_GCC_placepicker_v1" />
            <PlacePicker
              id="location"
              placeholder="Enter a place to report"
              onPlaceChange={handlePlaceChange}
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              type="file"
              label="Upload Photo"
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "image/png, image/jpeg, image/webp, image/heic, image/heif" }}
              onChange={handlePhotoChange}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Tags"
              placeholder="Enter tags"
              value={customTag}
              onChange={handleCustomTagChange}
              onKeyDown={handleTagsChange}
            />
            <Typography variant="body2" color="textSecondary">Separate tags with spaces.</Typography>
            <Box mt={1}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleTagDelete(index)}
                  color="primary"
                  style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                />
              ))}
            </Box>
            {tags.length === 0 && <Typography color="error">At least one tag is required.</Typography>}
            {tags.length > 4 && <Typography color="error">Maximum of 4 tags allowed.</Typography>}
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="severity">Severity</InputLabel>
            <Select
              label="severity"
              id="severity"
              value={severity}
              onChange={handleSeverityChange}
            >
              <MenuItem value=""><em>Select severity</em></MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <Box mt={2}>
            <Button variant="contained" color="primary" type="submit" fullWidth>Submit</Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default IssueForm;
