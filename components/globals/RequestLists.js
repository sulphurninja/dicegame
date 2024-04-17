// components/RequestsList.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';

const RequestsList = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('/api/getRequest');
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };
        fetchRequests();
    }, []);

    const toggleApproval = async (id) => {
        try {
            await axios.put(`/api/approveRequest/${id}`);
            setRequests(requests.map((request) =>
                request._id === id ? { ...request, approved: !request.approved } : request
            ));
        } catch (error) {
            console.error('Error toggling approval:', error);
        }
    };

    return (
        <div className='mt-4'>
            <Accordion type="single" collapsible className="w-full">
                {requests.map((request, index) => (
                    <AccordionItem key={index} value={`user-${index}`}>
                        <AccordionTrigger >
                            <div className='flex gap-4'>
                                <h1 className='font-bold text-xl'>{request.userName}</h1>
                                <h3 className='text-sm '>
                                    {request.message}
                                </h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <h1 className='text-start text-lg font-bold'>
                                🪙 {request.requestedAmount}
                            </h1>
                            <Button onClick={() => toggleApproval(request._id)}>
                                {request.approved ? 'Revoke Approval' : 'Approve'}
                            </Button>
                        </AccordionContent>



                           
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default RequestsList;
