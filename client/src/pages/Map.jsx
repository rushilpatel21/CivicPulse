// TODO Fix the map first time loading error 
// TODO Make the home page 
// TODO Get an icon for the civicpulse

import React, { useEffect, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import { getHeatmapData } from '../helper/api';

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 23.039809,
  lng: 72.5031242,
};

const HeatmapComponent = () => {
  const GOOGLE_API = import.meta.env.VITE_GOOGLE_PAID_API;
  const [heatMapData, setHeatMapData] = useState([]);

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
    if (window.google) {
      return heatMapData.map(point => ({
        location: new window.google.maps.LatLng(point.lat, point.lng),
        weight: point.weight,
      }));
    }
    return [];
  }, [heatMapData]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API,
    libraries: ['visualization'],
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
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
  ) : (
    <div>Loading...</div>
  );
};

export default React.memo(HeatmapComponent);