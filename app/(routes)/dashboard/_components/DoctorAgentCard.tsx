import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'

export type doctorAgent={
    id:number,
    specialist:string,
    description:string,
    image:string,
    agentPrompt:string,
    voiceId?:string,
    subscriptionRequired:boolean,
    gender:string
}
type props={
    doctorAgent:doctorAgent
}

function DoctorAgentCard({doctorAgent}:props) {
  return (
    <div className=''>
        <Image src={doctorAgent.image} alt={doctorAgent.specialist} className='w-full h-[250px] object-cover rounded-xl' width={200} height={300}/>
        <h2 className='font-bold mt-1'>{doctorAgent.specialist}</h2>
        <p className='line-clamp-2  text-sm text-gray-500'>{doctorAgent.description}</p>
        <Button className='w-full mt-2 '>Start Consulation <IconArrowRight/></Button>
    </div>
  )
}

export default DoctorAgentCard