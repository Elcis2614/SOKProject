// client/src/components/admin-view/order-details.jsx 

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommonForm from '../common/form'
import { Badge } from '../ui/badge'
import { DialogTitle } from '../ui/dialog'
import { DialogDescription } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import {updateOrderStatus, getOrderDetailsForAdmin} from '@/store/admin/order-slice'
import { useToast } from '@/hooks/use-toast'




const initialFormData ={
    status : ''
}

function AdminOrderDetailsView({ orderDetails }) {
    const [formData, setFormData] = useState(initialFormData);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { toast } = useToast();
  
    console.log(orderDetails, "orderDetailsorderDetails");
  
    function handleUpdateStatus(event) {
      event.preventDefault();
      const { status } = formData;
  
      dispatch(
        updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
      ).then((data) => {
        console.log(data, '123');
            if (data?.payload?.success) {
              dispatch(getOrderDetailsForAdmin(orderDetails?._id));
            // dispatch(getAllOrdersForAdmin());
              setFormData(initialFormData);
              toast({
                title: data?.payload?.message,
              });
            }
      });
    }
  
    return (
        <DialogDescription className='sm:max-w-[600px]'>
            <DialogTitle>Order Details</DialogTitle>
            <div className='grid gap-6'>
                <div className='grip gap-2'>
                    <div className='flex mt-4 items-center justify-between' >
                        <div className='font-medium'> Order ID</div>
                        <Label>{orderDetails?._id}</Label>
                    </div>
                    <div className='flex mt-2 items-center justify-between' >
                        <div className='font-medium'> Order Date</div>
                        <Label>{orderDetails?.orderDate.split('T')[0]}</Label>
                    </div>
                    <div className='flex mt-2 items-center justify-between' >
                        <div className='font-medium'> Order Price</div>
                        <Label>${orderDetails?.totalAmount}</Label>
                    </div>
                    <div className='flex mt-2 items-center justify-between' >
                        <div className='font-medium'> Payment Method </div>
                        <Label>{orderDetails?.paymentMethod}</Label>
                    </div>
                    <div className='flex mt-2 items-center justify-between' >
                        <div className='font-medium'> Payment Status </div>
                        <Label>{orderDetails?.paymentStatus}</Label>
                    </div>
                    <div className='flex mt-2 items-center justify-between' >
                        <div className='font-medium'> Order Status </div>
                        <Label>
                            <Badge className={`py-1 px-3 ${
                                orderDetails?.orderStatus === 'confirmed' ? 'bg-green-500'  
                                : orderDetails?.orderStatus=== 'rejected' ? 'bg-red-600' 
                                : 'bg-black'
                                }`}
                                >
                                {orderDetails?.orderStatus}
                            </Badge>
                            
                              
                        </Label>
                    </div>
                </div>
                
                <Separator />
                <div className='grid gap-4'>
                    <div className='grid gap-2'>
                        <div className='font-medium'>Order Details</div>
                        <ul className='grid gap-3'>
                           {
                            orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ?
                            orderDetails?.cartItems.map((item, index)=> 
                            <li key={item.productId || index} className='flex items-center justify-between'>
                                <span>Title : {item.title}</span>
                                <span>Quantity :{item.quantity}</span>
                                <span>Price : ${item.price}</span>
                            </li> 
                            )   
                            : null    
                        }
                        </ul>
                    </div>
                </div>
                <div className='grid gap-4'>
                    <div className='grid gap-2'>
                        <div className='font-medium'>Shipping Info</div>
                        {orderDetails?.addressInfo ? (
                            <div className='grid gap-0.5 text-muted-foreground'>
                                {/** render userName */}
                                 <div className='flex justify-between'>
                                        <span className='font-medium'>Name :</span>
                                        <span>{user.userName}</span>
                                    </div>
                                 {/** render Address */}    
                                 <div className='flex justify-between'>
                                    <span className='font-medium'>Address :</span>
                                    <span>{orderDetails.addressInfo.address}</span>
                                 </div>
                                  {/** render city */}
                                 <div className='flex justify-between'>
                                    <span className='font-medium'>City :</span>
                                    <span>{orderDetails.addressInfo.city}</span>
                                 </div>
                                  {/** render Pincode */}
                                 <div className='flex justify-between'>
                                    <span className='font-medium'>Pincode :</span>
                                    <span>{orderDetails.addressInfo.pincode}</span>
                                 </div>
                                  {/** render phone */}
                                 <div className='flex justify-between'>
                                    <span className='font-medium'>Phone :</span>
                                    <span>{orderDetails.addressInfo.phone}</span>
                                 </div>
                                  {/** render Notes */}
                                 <div className='flex justify-between'>
                                    <span className='font-medium'>Notes : </span>
                                    <span>{orderDetails.addressInfo.notes}</span>
                                 
                                 </div>
                            </div>
                        ) : (
                            <span>Address information not available for this order</span>
                        )}
                    </div>
                </div>
                <div>
                    <CommonForm 
                        formControls={[
                            {
                                label: "Order Status",
                                name: "status",
                                componentType: "select",
                                options: [
                                  { id: "pending", label: "Pending" },
                                  { id: "inProcess", label: "In process" },
                                  { id: "inShipping", label: "In Shipping" },
                                  { id: "rejected", label: "Rejected" },
                                  { id: "delivered", label: "Delivered" },

                                ],
                              },
                        ]}
                        formData={formData}
                        setFormData={setFormData}
                        buttonText={'Update Order Status'}
                        onSubmit={handleUpdateStatus}
                    />
                </div>
                    
            
            </div>
        </DialogDescription>
    )
}

export default AdminOrderDetailsView