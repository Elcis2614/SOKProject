// client/src/components/shopping-view/address-card.jsx 

import React from 'react'
import { Button } from '../ui/button'
import { CardFooter } from '../ui/card'
import { CardContent } from '../ui/card'
import { Card } from '../ui/card'
import { Label } from '../ui/label'

function AddressCard({addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress}) {
    return (
        <Card onClick={ 
            setCurrentSelectedAddress ?
            ()=>setCurrentSelectedAddress(addressInfo) 
            : null}
            >
            <CardContent className='grid p-4 gap-4'>
                <Label> Adress: {addressInfo?.address}</Label>
                <Label> City: {addressInfo?.city}</Label>
                <Label> Pincode: {addressInfo?.pincode}</Label>
                <Label> Phone: {addressInfo?.phone}</Label>
                <Label> Notes: {addressInfo?.notes}</Label>
            </CardContent>
            
            <CardFooter className='p-2flex justify-between'>
                <Button onClick={()=>handleEditAddress(addressInfo)}>Edit</Button>
                <Button onClick={()=>handleDeleteAddress(addressInfo)} >Delete</Button>
            </CardFooter>
            
        </Card>
    )
}

export default AddressCard
