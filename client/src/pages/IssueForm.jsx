import { useState } from 'react';
import { APILoader, PlacePicker } from '@googlemaps/extended-component-library/react';
import '../assets/IssueForm.css';

const IssueForm = () => {
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [severity, setSeverity] = useState('');

  const handlePlaceChange = (e) => {
    setLocation(e.target.value?.formattedAddress ?? '');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ location, photo, tags, severity });
    setLocation('');
    setPhoto(null);
    setTags([]);
    setCustomTag('');
    setSeverity('');
  };

  return (
    <div className="container">
      <h1>Report an Issue</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <APILoader apiKey="YOUR_API_KEY_HERE" solutionChannel="GMP_GCC_placepicker_v1" />
          <PlacePicker className="form-control" id="location" placeholder="Enter a place to see its address" onPlaceChange={handlePlaceChange} />
          <input type="hidden" className="form-control" id="location" value={location} readOnly required />
        </div>
        <div className="mb-3">
          <label htmlFor="photo" className="form-label">Upload Photo</label>
          <input type="file" className="form-control" id="photo" accept="image/*" onChange={handlePhotoChange} />
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
        </div>
        <div className="mb-3">
          <label htmlFor="severity" className="form-label">Severity</label>
          <select className="form-select" id="severity" value={severity} onChange={handleSeverityChange} required>
            <option value="">Select severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default IssueForm;
