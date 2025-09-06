import { useEffect, useState } from 'react';
import { auth } from '../components/firebase.jsx';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import { DataGrid } from '@mui/x-data-grid';
import socketService from '../services/socketService.js';
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
import {
  getIssuesByMonth,
  getIssuesByDepartmentType,
  getIssuesByClearance,
  getIssues
} from '../helper/api.js';

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

  const [issuesByMonth, setIssuesByMonth] = useState([]);
  const [issuesByDepartment, setIssuesByDepartment] = useState([]);
  const [issuesByClearance, setIssuesByClearance] = useState([]);
  const [issues, setIssues] = useState([]);

  const [labelsForBar, setLabelsForBar] = useState([]);
  const [dataForBar, setDataForBar] = useState([]);
  const [labelsForDoughnut, setLabelsForDoughnut] = useState([]);
  const [dataForDoughnut, setDataForDoughnut] = useState([]);
  const [dataForSummary, setDataForSummary] = useState([]);
  const [dataForTable, setDataForTable] = useState([]);

  useEffect(() => {
    getIssueMonth();
    getDept();
    getClearance();
    getIssuesForTable();
    
    // Initialize socket connection for real-time updates
    socketService.connect();
    
    // Listen for dashboard statistics updates
    const handleDashboardStatsUpdate = (updatedStats) => {
      console.log('📊 Dashboard stats updated:', updatedStats);
      setDataForSummary([updatedStats.open, updatedStats.inProgress, updatedStats.resolved]);
    };
    
    // Listen for issue progress updates
    const handleIssueProgressUpdate = (updateData) => {
      console.log('🔄 Issue progress updated:', updateData);
      // Refresh the issues table and statistics
      getClearance();
      getIssuesForTable();
    };
    
    // Listen for issue deletions
    const handleIssueDeleted = (deletedIssueId) => {
      console.log('🗑️ Issue deleted:', deletedIssueId);
      // Refresh all data when an issue is deleted
      getClearance();
      getIssuesForTable();
      getDept();
      getIssueMonth();
    };
    
        // Register socket event listeners
        socketService.onDashboardStatsUpdate(handleDashboardStatsUpdate);
        socketService.onIssueProgressUpdate(handleIssueProgressUpdate);
        socketService.onIssueDeleted(handleIssueDeleted);
        
        // Test connection after a short delay
        setTimeout(() => {
          if (socketService.testConnection()) {
            console.log('🧪 Socket connection test sent');
          }
        }, 3000);    // Cleanup function
    return () => {
      socketService.off('dashboard_stats_updated', handleDashboardStatsUpdate);
      socketService.off('issue_progress_updated', handleIssueProgressUpdate);
      socketService.off('issue_deleted', handleIssueDeleted);
      socketService.disconnect();
    };
  }, []);

  const getClearance = async () => {
    const data = await getIssuesByClearance();
    setIssuesByClearance(data);
  }

  const getDept = async () => {
    const data = await getIssuesByDepartmentType();
    setIssuesByDepartment(data);
  }

  const getIssueMonth = async () => {
    const data = await getIssuesByMonth();
    setIssuesByMonth(data);
  }

  const getIssuesForTable = async () => {
    const data = await getIssues();
    setIssues(data);
  }

  useEffect(() => {
    if(!issuesByMonth){
      return;
    }
    const labels = Object.keys(issuesByMonth).reverse();
    const data = Object.values(issuesByMonth).reverse();
    setLabelsForBar(labels);
    setDataForBar(data);
  }, [issuesByMonth]);

  useEffect(() => {
    if(!issuesByDepartment){
      return;
    }
    const labels = Object.keys(issuesByDepartment);
    const data = Object.values(issuesByDepartment);
    setLabelsForDoughnut(labels);
    setDataForDoughnut(data);
  }, [issuesByDepartment]);

  useEffect(() => {
    if(!issuesByClearance){
      return;
    }
    const data = Object.values(issuesByClearance);
    
    setDataForSummary(data);
  }, [issuesByClearance]);

  useEffect(() => {
    if(!issues){
      return;
    }
    const data = issues.map((issue) => {
      const dataMap = new Map([
        [1, 'Open'],
        [2, 'In Progress'],
        [3, 'Resolved']
      ]);
      issue.data.progress = dataMap.get(issue.data.progress);
      issue.data.date = convertTimestampToDate(issue.data.date._seconds, issue.data.date._nanoseconds);
      return {
        id: issue.id,
        location: issue.data.location,
        department: issue.data.department,
        severity: issue.data.severity,
        status: issue.data.progress,
        date: issue.data.date,
      };
    });
    setDataForTable(data);
    
  },[issues])

  const barData = {
    labels: labelsForBar,
    datasets: [
      {
        label: 'Reports per Month',
        data: dataForBar,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: labelsForDoughnut,
    datasets: [
      {
        data: dataForDoughnut,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#FF9F80', '#8ACB88', '#E0E0E0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#FF9F80', '#8ACB88', '#E0E0E0'],
      },
    ],
  };

  const summaryData = [
    { label: 'Resolved Cases', value: dataForSummary[2], color: '#4caf50' },
    { label: 'Cases in Progress', value: dataForSummary[1], color: '#ffeb3b' },
    { label: 'Unresolved Cases', value: dataForSummary[0], color: '#f44336' },
  ];

  const convertTimestampToDate = (seconds, nanoseconds) => {
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    return new Date(milliseconds).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  const columns = [
    { field: 'id', headerName: 'Issue ID', width: 235 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'department', headerName: 'Department', width: 160 },
    { field: 'severity', headerName: 'Severity', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'date', headerName: 'Date Reported', width: 200 },
  ];

  const rows = dataForTable;

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
      <Typography variant="h4" gutterBottom style={{ paddingTop: '80px' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Reports per Month</Typography>
            <div style={{ position: 'relative', width: '100%', height: '400px' }}>
              <Bar data={barData} options={{ maintainAspectRatio: false, responsive: true }} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Reports by Department</Typography>
            <div style={{ position: 'relative', width: '100%', height: '400px' }}>
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
