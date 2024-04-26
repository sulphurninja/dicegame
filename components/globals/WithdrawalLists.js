// components/RequestsList.js

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { DataContext } from '../../store/GlobalState';
import ExcelJS from 'exceljs';

const WithdrawalLists = () => {
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const [requests, setRequests] = useState([]);
    const [kycs, setKycs] = useState([]);
    const [userName, setUserName] = useState(auth && auth.user && auth.user.userName ? auth.user.userName : "");

    useEffect(() => {
        if (auth && auth.user && auth.user.userName) {
            // Update state and localStorage when user is authenticated
            setUserName(auth.user.userName);
        }
    }, [auth]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`/api/getWithdraw`);
                setRequests(response.data.requests);
                setKycs(response.data.kyc);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };
        fetchRequests();
    }, []);

    const toggleUnapproval = async (id) => {
        try {
            await axios.put(`/api/unapproveWithdraw/${id}`);
            setRequests(requests.map((request) =>
                request._id === id ? { ...request, unapproved: !request.unapproved } : request
            ));
        } catch (error) {
            console.error('Error toggling approval:', error);
        }
    };


    const toggleApproval = async (id) => {
        try {
            await axios.put(`/api/approveWithdraw/${id}`);
            setRequests(requests.map((request) =>
                request._id === id ? { ...request, approved: !request.approved } : request
            ));
        } catch (error) {
            console.error('Error toggling approval:', error);
        }
    };

    const downloadExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Withdrawal Requests');
    
        // Add headers
        worksheet.addRow(['UserName', 'Amount', 'Message', 'BankingName', 'AccountNo', 'IFSCCode']);
    
        // Add data rows
        requests
            .filter(request => !request.unapproved && !request.approved)
            .forEach(request => {
                const kyc = kycs.find(kyc => kyc.userName === request.userName);
                worksheet.addRow([
                    request.userName,
                    request.requestedAmount,
                    request.message,
                    kyc ? kyc.bankingName : '',
                    kyc ? kyc.AccountNo : '',
                    kyc ? kyc.IFSCCode : ''
                ]);
            });
    
        // Write workbook to file
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'withdrawal_requests.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };
    
    return (
        <div className='mt-4'>
            <Button onClick={downloadExcel}>Download Excel File</Button>
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
                            <div className='flex gap-4 justify-center'>
                                <Button className="bg-red-500" onClick={() => toggleUnapproval(request._id)}>
                                    Reject
                                </Button>
                                <Button className="bg-green-500" onClick={() => toggleApproval(request._id)}>
                                    Accept
                                </Button>
                            </div>
                        </AccordionContent>




                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default WithdrawalLists;
