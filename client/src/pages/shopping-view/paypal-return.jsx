// client/src/pages/shopping-view/paypal-return.jsx 

import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";


function PaypalReturnPages() {
    
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId'); // paymentId from the checkout link
    const payerId = params.get('PayerID');  // PayerID from the checkout link "http://localhost:5173/shop/paypal-return?paymentId=PAYID-M4IMXKQ1H634345XV0941105&token=EC-3MN091130P8606104&PayerID=TR5JFEZN2ZYWN"
    
    useEffect(()=>{
        if(paymentId && payerId){
            const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
            console.log("Attempting to capture payment with:", { paymentId, payerId, orderId });
            
            dispatch(capturePayment({ paymentId, payerId, orderId }))
                .then((data) => {
                 console.log('Capture payment response:', data);
                if (data?.payload?.success) {
                    sessionStorage.removeItem("currentOrderId");
                    window.location.href = "/shop/payment-success";
                } else {
                    console.error('Payment capture failed:', data?.payload);
                }
              })
              .catch((error) => {
                console.error('Error during payment capture:', error);
                // Handle error (e.g., show an error message to the user)
            });
        }
            
    }, [paymentId, payerId, dispatch]);


    
    return (
        <Card>
            <CardHeader>
                <CardTitle> Processing Payment ... Please wait! </CardTitle>
            </CardHeader>
        </Card>
    )
}

export default PaypalReturnPages
