import React, { useEffect, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import { getHeatmapData } from '../helper/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { auth } from '../components/firebase.jsx';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 23.039809,
  lng: 78.5031242,
};

const libraries = ['visualization'];

const HeatmapComponent = () => {

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const GOOGLE_API = import.meta.env.VITE_GOOGLE_PAID_API;
  const [heatMapData, setHeatMapData] = useState([]);

  useEffect(() => {
    const usingSwal = () => {
      withReactContent(Swal).fire({
        icon: "error",
        title: "User Not Logged In",
        text: "Please sign in to view Heat Map",
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

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const data = await getHeatmapData();
        setHeatMapData(data);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      }
    };

    fetchHeatmapData();
  }, []);

  const heatmapPoints = useMemo(() => {
    try{
      if (window.google) {
        return heatMapData.map(point => ({
          location: new window.google.maps.LatLng(point.lat, point.lng),
          weight: point.weight,
        }));
      }
      return [];
    }catch (error) {
      console.error('Error creating heatmap points:', error);
      alert('Please reload this page once, if the issue persists please report a bug.\nSorry for the inconvenience.');
      return
    }
  }, [heatMapData]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API,
    libraries: libraries,
  });

  return( 
  <>
    { isLoaded && loggedIn &&
      <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5.8}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      <HeatmapLayer
        data={heatmapPoints}
        options={{
          radius: 50,
          opacity: 0.6,
          gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 200, 255, 1)',
            'rgba(0, 150, 255, 1)',
            'rgba(0, 100, 255, 1)',
            'rgba(0, 50, 255, 1)',
            'rgba(0, 0, 255, 1)',
          ],
        }}
      />
    </GoogleMap>

    }
    {
      !isLoaded && loggedIn && <div>Loading...</div>
    }
  </>)
};

export default React.memo(HeatmapComponent);