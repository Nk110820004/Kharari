import { useCallback } from 'react';
import { User } from '../App';

// This is a Razorpay Test Key. Replace with your actual key in a real application.
const RAZORPAY_KEY = 'rzp_test_YourTestKey'; 

interface RazorpayOptions {
    key: string;
    amount: number; // in the smallest currency unit (e.g., paise for INR)
    currency: string;
    name: string;
    description: string;
    image: string; // URL of your logo
    handler: (response: any) => void;
    prefill: {
        name?: string;
        email?: string; // Razorpay requires email
        contact?: string;
    };
    notes?: {
        address?: string;
    };
    theme: {
        color: string;
    };
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface PaymentDetails {
    amount: number;
    name: string;
    onSuccess: () => void;
}

export const useRazorpay = (user: User | null) => {
    
    const displayRazorpay = useCallback(async ({ amount, name, onSuccess }: PaymentDetails) => {
        if (!window.Razorpay) {
            alert('Razorpay SDK not loaded. Please check your internet connection.');
            return;
        }

        const options: RazorpayOptions = {
            key: RAZORPAY_KEY,
            amount: amount,
            currency: 'INR',
            name: 'Khalari',
            description: name,
            image: '/vite.svg',
            handler: (response) => {
                console.log('Razorpay Response:', response);
                // In a real app, you would verify this payment on your backend
                // using response.razorpay_payment_id
                alert('Payment Successful!');
                onSuccess();
            },
            prefill: {
                name: user?.name,
                email: 'test.user@example.com', // Placeholder email
                contact: user?.phone,
            },
            notes: {
                address: 'Khalari Learning Corp.',
            },
            theme: {
                color: '#2563EB', // Blue-600
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
            console.error('Razorpay Payment Failed:', response.error);
            alert(`Payment Failed: ${response.error.description}`);
        });
        
        paymentObject.open();

    }, [user]);

    return { displayRazorpay };
};
