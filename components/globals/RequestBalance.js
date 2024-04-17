import { useContext, useEffect, useState } from 'react';
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { DataContext } from '../../store/GlobalState';

export default function RequestBalance() {
    const [message, setMessage] = useState('');
    const [requestedAmount, setRequestedAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const [userName, setUserName] = useState(auth && auth.user && auth.user.userName ? auth.user.userName : "");


    useEffect(() => {
        if (auth && auth.user && auth.user.userName) {
            // Update state and localStorage when user is authenticated
            setUserName(auth.user.userName);
        }
    }, [auth]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/requestBalance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, requestedAmount, userName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong.');
            }

            setSuccessMessage('Request submitted successfully.');
            setMessage('');
            setRequestedAmount('');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='text-white  p-6'>
            <form onSubmit={handleSubmit}>
                <div className=''>
                    <div className='flex gap-4'>
                        <label className='mt-2' htmlFor="requestedAmount"> Amount: </label>
                        <Input
                            type="number"
                            id="requestedAmount"
                            value={requestedAmount}
                            className='w-10/12 text-black'
                            onChange={(e) => setRequestedAmount(e.target.value)}
                        />
                    </div>
                    <div className='flex gap-4 mt-4'>

                        <label htmlFor="message">Message:</label>
                        <Input
                            type="text"
                            id="message"
                            value={message}
                            className='w-10/12 text-black'
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>

                <Button className='mt-4 text-white bg-gray-700 ' type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Request'}
                </Button>
            </form>
            {errorMessage && <p>Error: {errorMessage}</p>}
            {successMessage && <p className='text-green-500'>{successMessage}</p>}
        </div>
    );
}
