// const IssueDetails = () => {
//     return (
//       <div>
//         <h1>IssueDetails</h1>
        
//       </div>
//     );
//   };
  
//   export default IssueDetails;
  

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Radar from 'radar-sdk-js';
import '../styles/Map.css';

const Map = () => {
  useEffect(() => {
    Radar.initialize('prj_test_pk_77365fe4ac12e1c73c9ac314d30a8ae3605433e2');
  }, []);

  const handleSelection = (address) => {
    console.log('Selected address:', address);
  };

  return (
    <div className="map-container">
      <h1>Map</h1>
      <Autocomplete onSelection={handleSelection} />
    </div>
  );
};

const Autocomplete = ({ onSelection }) => {
  useEffect(() => {
    Radar.ui.autocomplete({
      container: 'autocomplete',
      width: '100%',
      onSelection: onSelection,
    });
  }, [onSelection]);

  return (
    <div id="autocomplete" className="autocomplete-container" />
  );
};

Autocomplete.propTypes = {
  onSelection: PropTypes.func.isRequired,
};

export default Map;


