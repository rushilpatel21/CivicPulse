import { useEffect, useState } from 'react';
import { auth, db } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Typography, Container, Collapse, IconButton, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '../styles/Home.css';

const Home = () => {
  const [userName, setUserName] = useState("User");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.firstName);
        } else {
          console.log("User is not logged in");
        }
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const faqs = [
    {
      "question": "How do I report an issue using CivicPulse?",
      "answer": "Reporting an issue is simple and straightforward. Just log in to your CivicPulse account, click on the \"Report Issue\" button, and fill in the required details such as the issue description, location, and upload a photo if available. Once submitted, CivicPulse will route your report to the appropriate department for resolution."
    },
    {
      "question": "What types of issues can I report on CivicPulse?",
      "answer": "You can report a wide range of community issues on CivicPulse, including potholes, street lighting problems, graffiti, public safety concerns, sanitation issues, and more."
    },
    {
      "question": "How does CivicPulse ensure my reported issue reaches the correct department?",
      "answer": "CivicPulse leverages Firebase Auth and the Gemini API, to automatically route your reported issue to the appropriate department. Our system analyzes the details of your report and matches it with the relevant municipal authorities to ensure efficient handling and resolution."
    },
    {
      "question": "Can I track the status of my reported issue?",
      "answer": "Yes, you can track the status of your reported issue in real-time. Once you submit an issue, you will receive updates on its progress through your CivicPulse account. You can also view the history and current status of all your reported issues in one convenient place."
    },
    {
      "question": "Is there a cost to use CivicPulse?",
      "answer": "CivicPulse is a free platform designed to enhance community engagement and improve the efficiency of issue resolution. There is no cost to report issues or track their progress. Our goal is to provide a seamless and accessible way for you to contribute to the betterment of your community."
    }
  ];

  const aboutUsText = `
  Welcome to CivicPulse, your gateway to active community engagement and seamless issue resolution. CivicPulse empowers you to effortlessly report and track local issues, ensuring your voice is heard and action is taken. Whether it's a pothole, graffiti, or a community improvement idea, CivicPulse simplifies the process of bringing attention to these issues.
  With CivicPulse, you can submit issues directly from your mobile device or desktop, complete with location details and photos, making it easier than ever to communicate the specifics of what needs attention. Once submitted, our platform automatically routes your concern to the relevant municipal department, ensuring it reaches the right authorities for swift resolution.
  Stay informed every step of the way with real-time updates on the status of your reported issues. From submission to resolution, CivicPulse keeps you in the loop, fostering transparency and accountability within your community. Join us in making a positive impact—because when communities come together, change happens.
  `;

  const handleFAQToggle = (index) => {
    if (expandedFAQ === index) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(index);
    }
  };

  return (
    <div className="home-container">
      <div className="gradient-text-section">
        <Typography variant="h2" gutterBottom className="gradient-text">
          Hello, {userName}
        </Typography>
        <Typography variant="h3" gutterBottom className="gradient-text">
          Welcome to Civic Pulse
        </Typography>
      </div>

      <div className="about-us-section">
        <Container>
          <Typography variant="h5" gutterBottom className="section-title">
            About Us
          </Typography>
          <Typography variant="body1" paragraph className="section-content">
            {aboutUsText}
          </Typography>
        </Container>
      </div>

      <div className="faqs-section">
        <Container>
          <Typography variant="h5" gutterBottom className="section-title">
            FAQs
          </Typography>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-header">
                <Typography variant="body1" className="faq-question">
                  {faq.question}
                </Typography>
                <IconButton
                  className="expand-button"
                  onClick={() => handleFAQToggle(index)}
                  aria-expanded={expandedFAQ === index}
                  aria-label="toggle answer"
                >
                  {expandedFAQ === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </div>
              <Collapse in={expandedFAQ === index} timeout="auto" unmountOnExit>
                <Box mt={1} className="faq-answer">
                  {faq.answer}
                </Box>
              </Collapse>
            </div>
          ))}
        </Container>
      </div>

      <footer className="footer" style={{backgroundColor: '#254fa2', width: '100vw'}}>
        <Typography variant="body1" className="footer-text">
          &copy; 2024 Civic Pulse. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default Home;
