import { useEffect, useState } from 'react';
import { auth } from '../components/firebase.jsx';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import { DataGrid } from '@mui/x-data-grid';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const barData = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Reports per Month',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['Road', 'Electricity', 'Water', 'Health', 'Others'],
    datasets: [
      {
        data: [300, 50, 100, 40, 60],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
      },
    ],
  };

  const summaryData = [
    { label: 'Resolved Cases', value: '70%', color: '#4caf50' },
    { label: 'Cases in Progress', value: '20%', color: '#ffeb3b' },
    { label: 'Unresolved Cases', value: '10%', color: '#f44336' },
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'issue', headerName: 'Issue', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'date', headerName: 'Date Reported', width: 150 },
  ];

  const rows = [
    { id: 1, issue: 'Pothole', status: 'Unresolved', department: 'Road', date: '2024-02-15' },
    { id: 2, issue: 'Streetlight', status: 'Resolved', department: 'Electricity', date: '2024-03-22' },
  ];

  useEffect(() => {
    const usingSwal = () => {
      withReactContent(Swal).fire({
        icon: "error",
        title: "User Not Logged In",
        text: "Please sign in to view Dashboard",
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

  return (
    <>
      {loggedIn && <div>
        <Container>
      <Typography variant="h4" gutterBottom>
        Civic Pulse Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Reports per Month</Typography>
            <div style={{ position: 'relative', width: '100%', height: '350px' }}>
              <Bar data={barData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Reports by Department</Typography>
            <div style={{ position: 'relative', width: '100%', height: '350px' }}>
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
          </Paper>
        </Grid>
        {summaryData.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper elevation={3} style={{ padding: '16px', backgroundColor: item.color }}>
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h4">{item.value}</Typography>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Latest Issues</Typography>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid rows={rows} columns={columns} pageSize={5} />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
      </div> }
    
    </>
  );
};

export default Dashboard;
