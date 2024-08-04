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

// import React, { useEffect } from 'react';
// import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
// import { getHeatmapData } from '../helper/api';

// const containerStyle = {
//   width: '100vw',
//   height: '100vh'
// };

// const center = {
//   lat: 23.039809,
//   lng: 72.5031242
// };

// function MyComponent() {
//   const GOOGLE_API = import.meta.env.VITE_GOOGLE_PAID_API;
//   const [map, setMap] = React.useState(null);
//   const [heatMapData, setHeatMapData] = React.useState([]);

//   useEffect(() => {
//     const fetchHeatmapData = async () => {
//       try {
//         const data = await getHeatmapData();
//         setHeatMapData(data);
//       } catch (error) {
//         console.error('Error fetching heatmap data:', error);
//       }
//     };

//     fetchHeatmapData();
//   }, []);

//   const onLoad = React.useCallback(function callback(map) {
//     setMap(map);
//   }, []);

//   const onUnmount = React.useCallback(function callback(map) {
//     setMap(null);
//   }, []);

//   const heatmapPoints = React.useMemo(() => {
//     if (window.google) {
//       return heatMapData.map(point => {
//         return {
//           location: new window.google.maps.LatLng(point.lat, point.lng),
//           weight: point.weight
//         };
//       });
//     }
//     return [];
//   }, [heatMapData]);

//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: GOOGLE_API,
//     libraries: ['visualization']
//   });

//   return isLoaded ? (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={center}
//       zoom={10}
//       onLoad={onLoad}
//       onUnmount={onUnmount}
//     >
//       <HeatmapLayer
//         data={heatmapPoints}
//         options={{
//           radius: 50,
//           opacity: 0.6,
//           gradient: [
//             'rgba(0, 255, 255, 0)',
//             'rgba(0, 255, 255, 1)',
//             'rgba(0, 200, 255, 1)',
//             'rgba(0, 150, 255, 1)',
//             'rgba(0, 100, 255, 1)',
//             'rgba(0, 50, 255, 1)',
//             'rgba(0, 0, 255, 1)'
//           ]
//         }}
//       />
//     </GoogleMap>
//   ) : (
//     <div>Loading...</div>
//   );
// }

// export default React.memo(MyComponent);