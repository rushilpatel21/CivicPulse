import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';

export const SwalSuccess = async () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        icon: 'success',
        title: 'Issue Sent!',
        text: 'Your Issue has been submitted successfully.',
    });
};

export const SwalError = async () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        icon: 'error',
        title: 'Issue Not Submitted!',
        text: 'An error occurred while submitting your issue.',
    });
};