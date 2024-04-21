import { useContext, useEffect, useState } from 'react';
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { DataContext } from '../../store/GlobalState';
import { Accordion, AccordionContent, AccordionTrigger } from '../ui/accordion';
import { Drawer, DrawerTrigger, DrawerHeader } from '../ui/drawer';
import { AccordionItem } from '@radix-ui/react-accordion';
import axios from 'axios'

export default function RequestBalance() {
    const [message, setMessage] = useState('');
    const [requestedAmount, setRequestedAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');
    const [errorMessage3, setErrorMessage3] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successMessage2, setSuccessMessage2] = useState('');
    const [successMessage3, setSuccessMessage3] = useState('');

    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const [userName, setUserName] = useState(auth && auth.user && auth.user.userName ? auth.user.userName : "");
    const [kycApproved, setKycApproved] = useState(auth && auth.user && auth.user.kycApproved);
    const [kycSubmitted, setKycSubmitted] = useState(auth && auth.user && auth.user.kycSubmitted);
    const [aadharUrl, setAadharUrl] = useState('');
    const [panUrl, setPanUrl] = useState('');
    const [cancelledCheckUrl, setCancelledCheckUrl] = useState('');
    const [mobNo, setMobNo] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const handleAadharUpload = (event) => {
        const file = event.target.files[0];
        uploadDocument(file, setAadharUrl);
    };

    const handlePanUpload = (event) => {
        const file = event.target.files[0];
        uploadDocument(file, setPanUrl);
    };

    const handleCancelledCheckUpload = (event) => {
        const file = event.target.files[0];
        uploadDocument(file, setCancelledCheckUrl);
    };


    useEffect(() => {
        if (auth && auth.user && auth.user.userName) {
            // Update state and localStorage when user is authenticated
            setUserName(auth.user.userName);
            setKycApproved(auth.user.kycApproved);
            setKycSubmitted(auth.user.kycSubmitted);
        }
    }, [auth]);

    console.log(aadharUrl, 'aadhar url')
    console.log(panUrl, 'pan url')
    console.log(cancelledCheckUrl, 'cancelledcheck url')

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

    const handleSubmitKyc = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/uploadKyc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ aadharUrl, panUrl, userName, mobNo, cancelledCheckUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong.');
            }

            setSuccessMessage3('KYC Submitted Successfully!');
            setMessage('');
            setRequestedAmount('');
        } catch (error) {
            setErrorMessage2(error.message);
        } finally {
            setIsLoading(false);
        }
    };




    const uploadDocument = (file, setUrl) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'lscivs0l');
        setIsUploading(true);
        axios.post('https://api.cloudinary.com/v1_1/dxcer6hbg/image/upload', formData)
            .then((response) => {
                setUrl(response.data.secure_url);
                setIsUploading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsUploading(false);
                setUploadError('Failed to upload document.');
            });
    };




    return (
        <div className='text-white p  p-6'>
            <Accordion type="single" collapsible className="w-full p-3 mt-4 rounded-xl bg-black">

                <AccordionItem value='item-1' >

                    <AccordionTrigger >
                        <div className=' '>
                            <h1>Withdraw Balance</h1>
                        </div>

                    </AccordionTrigger>
                    {kycApproved ? (
                        <div>
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
                        </div>
                    ) : (
                        <div>
                            <h1 className='text-green-200'>Complete your KYC to Withdraw</h1>

                            <AccordionContent>
                                <div className="grid  grid-cols-1 gap-12 lg:grid-cols-3  mt-4">
                                    <div className='border rounded p-2'>
                                        <div className='flex justify-between'>
                                            <img src='/aadhar.png' className='h-12 rounded object-cover ' />
                                            <h1 className='mt-2 font-bold'>1. Upload Aadhar Card</h1>

                                            <h1 className='text-2xl'></h1>
                                        </div>
                                        <input type="file" className='mt-1' accept="image/*" onChange={handleAadharUpload} />


                                        {/* Add upload component for Aadhar Card */}
                                    </div>
                                    <div className='border rounded p-2'>
                                        <div className='flex justify-between'>
                                            <img src='/pan.webp' className='h-12 rounded object-cover ' />
                                            <h1 className='mt-2 font-bold'>2. Upload PAN Card</h1>
                                            <h1 className='text-2xl'></h1>
                                        </div>
                                        <input type="file" className='' accept="image/*" onChange={handlePanUpload} />

                                        {/* Add upload component for PAN Card */}
                                    </div>
                                    <div className='border rounded p-2'>
                                        <div className='flex justify-between'>
                                            <img src='/cancel.webp' className='h-12 rounded object-cover ' />

                                            <h1 className='mt-2 font-bold'>3. Upload Cancelled Check</h1>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCancelledCheckUpload}
                                        />
                                        {/* Add upload component for PAN Card */}
                                    </div>

                                </div>
                                <div className='mt-2'>
                                    <div>
                                        <h1 className='mt-2 mb-2 font-bold'>📱 Enter Your Mob.No</h1>
                                        <Input type='number' value={mobNo} onChange={(e) => setMobNo(e.target.value)} className='text-black' />
                                    </div>
                                    {/* Add upload component for PAN Card */}
                                </div>
                                <Button type="submit" onClick={handleSubmitKyc} className='mt-2 w-full'>'Submit Documents</Button>

                            </AccordionContent>
                            {/* Display upload status */}
                            {isUploading && <p>Uploading...</p>}
                            {uploadSuccess && <p>Upload successful!</p>}
                            {uploadError && <p>Error: {uploadError}</p>}
                            {errorMessage3 && <p>Error: {errorMessage3}</p>}
                            {successMessage3 && <p className='text-green-500'>{successMessage3}</p>}
                        </div>
                    )}
                </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="w-full p-3 mt-4 rounded-xl bg-black">
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


        </div >
    );
}
