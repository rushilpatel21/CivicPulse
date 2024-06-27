import CircularProgress from '@mui/joy/CircularProgress';
import Box from '@mui/joy/Box';

const LoaderOverlay = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(1px)',
      }}
    >
      <CircularProgress
        determinate={false}
        size="lg"
        variant="soft"
      />
    </Box>
  );
};

export default LoaderOverlay;
