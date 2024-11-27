// client/src/components/shopping-view/address.jsx 

import { addressFormControls } from '@/config'
import { useToast } from '@/hooks/use-toast'
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from '@/store/shop/address-slice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommonForm from '../common/form'
import { CardContent } from '../ui/card'
import { CardTitle } from '../ui/card'
import { CardHeader } from '../ui/card'
import { Card } from '../ui/card'
import AddressCard from './address-card'

const initialAddressFormData = {
    address : '',
    city : '',
    phone: '',
    pincode : '',
    notes : ''
}

function Address({setCurrentSelectedAddress}) {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [ currentEditedId, setCurrentEditedId ] = useState(null);
    const dispatch = useDispatch();
    const {user} = useSelector((state )=> state.auth);
    const { addressList } = useSelector((state)=> state.shopAddress);
    const {toast} = useToast()
    
    function handleManageAddress(event){
        event.preventDefault();
        
        if(addressList.length >= 3 && currentEditedId === null){
            setFormData(initialAddressFormData);
            toast({
                title : 'You can add Max 3 address',
                variant : 'destructive'
            })
            
            return;
        }
        
        currentEditedId !== null ? dispatch(editaAddress({
            userId : user?.id, addressId : currentEditedId, formData
        })).then( (data) => {
            if(data?.payload?.success){
                dispatch(fetchAllAddresses())
                setCurrentEditedId(null)
                setFormData(initialAddressFormData)
                toast({
                    title: 'Address Updated successfully'
                })
            }
        }) 
        :
        dispatch(
            addNewAddress({
                ...formData,
                userId : user?.id,
            })).then(data=>{
                console.log('data', data);
                if(data?.payload?.success){
                    dispatch(fetchAllAddresses(user?.id))
                    setFormData(initialAddressFormData)
                    toast({
                        title: 'Address added successfully'
                    })
                }
        })
    }
    
    function isFormValid(){
        return Object.keys(formData)
            .map( (key) => formData[key].trim() !== '')
            .every((item) => item);
    }
    
    useEffect(() => {
        dispatch(fetchAllAddresses(user?.id));
    }, [dispatch]);
    
    console.log('addressList: ', addressList)
    
    function handleDeleteAddress(getCurrentAddress){
        console.log(getCurrentAddress);
        
        dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id));
                toast({
                    title : 'Address deleted successfully',
                })
            }
        });
    }
    
    function handleEditAddress(getCuurentAddress){ handleEditAddress
        setCurrentEditedId(getCuurentAddress?._id)
        setFormData({  // to fill the form
            ...formData,
            address : getCuurentAddress?.address,
            city : getCuurentAddress?.city,
            phone: getCuurentAddress?.phone,
            pincode : getCuurentAddress?.pincode,
            notes : getCuurentAddress?.notes
            
        })
    }
    
    return (
        <Card className='bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto my-4'>
        {/* Grid layout for displaying addresses */}
        <div className='mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg font-semibold text-gray-500'>
            {addressList && addressList.length > 0
                ? addressList.map((singleAddressItem) => (
                    <AddressCard 
                        handleDeleteAddress={handleDeleteAddress} 
                        key={singleAddressItem._id} 
                        addressInfo={singleAddressItem} 
                        handleEditAddress={handleEditAddress}
                        setCurrentSelectedAddress={setCurrentSelectedAddress}
                        
                        />
                ))
                : <p>No addresses found</p>
            }
        </div>

        {/* Add New Address Form */}
            <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900"> {
                    currentEditedId !== null ? 'Edit' : 'Add '
                } </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <CommonForm 
                    formControls={addressFormControls}
                    formData = {formData}
                    setFormData = {setFormData}
                    bittonText = {currentEditedId !== null ? 'Edit Address' : 'Add New Address'}
                    onSubmit = {handleManageAddress}
                    isBtnDisabled={!isFormValid()}
                />                
            </CardContent>
           
        </Card>
    )
}

export default Address;
