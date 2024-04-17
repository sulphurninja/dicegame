import { useContext, useEffect, useState } from 'react';
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { DataContext } from '../../store/GlobalState';
import { Accordion, AccordionContent, AccordionTrigger } from '../ui/accordion';
import { AccordionItem } from '@radix-ui/react-accordion';

export default function RequestBalance() {
    const [message, setMessage] = useState('');
    const [requestedAmount, setRequestedAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successMessage2, setSuccessMessage2] = useState('');

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


    const handleWithdraw = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/withdrawBalance', {
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

            setSuccessMessage2('Withdraw Request successful!');
            setMessage('');
            setRequestedAmount('');
        } catch (error) {
            setErrorMessage2(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='text-white p  p-6'>
            <Accordion type="single" collapsible className="w-full p-3 rounded-xl bg-black">
                <AccordionItem value='item-1' >
                    <AccordionTrigger >
                        <div className='flex gap-4 '>
                            <h1>Request Balance</h1>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <form className='' onSubmit={handleSubmit}>
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
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className="w-full p-3 mt-4 rounded-xl bg-black">
            
                <AccordionItem value='item-1' >
                    <AccordionTrigger >
                        <div className=' '>
                            <h1>Withdraw Balance</h1>
                        </div>

                    </AccordionTrigger>
            <p className='text-green-200'>Minimum Withdrawal Amt : 1000</p>

                    <AccordionContent>
                        <form className='' onSubmit={handleWithdraw}>
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
                        {errorMessage2 && <p>Error: {errorMessage2}</p>}
                        {successMessage2 && <p className='text-green-500'>{successMessage2}</p>}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
