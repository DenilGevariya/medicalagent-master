'use client';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { doctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, Loader, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

type messages = {
  role: string;
  text: string;
};

function VoiceAgent() {
  const { sessionId } = useParams();

  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRoll, setCurrentRoll] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);
  const GetSessionDetails = async () => {
    const result = await axios.get('/api/session-chat?sessionId=' + sessionId);
    console.log(result.data);
    setSessionDetail(result.data);
  };

  const StartCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    //@ts-ignore
    let assistant_id;
    if (sessionDetail?.selectedDoctor?.gender === 'male') {
      assistant_id = process.env.NEXT_PUBLIC_VAPI_MALE_VOICE_ASSISTANT_ID;
    } else {
      assistant_id = process.env.NEXT_PUBLIC_VAPI_FEMALE_VOICE_ASSISTANT_ID;
    }
    vapi.start(assistant_id);
    vapi.on('call-start', () => {
      console.log('Call started');
      setCallStarted(true);
    });
    vapi.on('call-end', () => {
      console.log('Call ended');
      setCallStarted(false);
    });
    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        const { role, transcriptType, transcript } = message;
        console.log(`${message.role}: ${message.transcript}`);
        if (transcriptType == 'partial') {
          setLiveTranscript(transcript);
          setCurrentRoll(role);
        } else if (transcriptType == 'final') {
          setMessages((prve: any) => [
            ...prve,
            { role: role, text: transcript },
          ]);
          setLiveTranscript('');
          setCurrentRoll(null);
        }
      }
    });

    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setCurrentRoll('Assistant');
    });
    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setCurrentRoll('User');
    });
  };

  const endCall = async () => {
    if (!vapiInstance) return;
    if (vapiInstance) {
      console.log('ENding call...');
      vapiInstance.stop();
      setCallStarted(false);
      setVapiInstance(null);
      const result = await GenrateReport();
      router.replace('/dashboard');
    }
  };

  const GenrateReport = async () => {
    setLoading(true);
    const result = await axios.post('/api/medical-report', {
      messages: messages,
      sessionDetail: sessionDetail,
      sessionId: sessionId,
    });
    console.log(result.data);
    setLoading(false);
    return result.data;
  };

  return (
    <div className="p-5 bg-secondary border rounded-3xl">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'} `}
          />
          {callStarted ? 'Connected..' : 'Not Connected'}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

      {sessionDetail && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={sessionDetail?.selectedDoctor?.image}
            alt={sessionDetail?.selectedDoctor?.specialist}
            width={80}
            height={80}
            className="h-[100px] w-[100px] object-cover rounded-full"
          />
          <h2 className="mt-2 text-lg">
            {sessionDetail?.selectedDoctor?.specialist}
          </h2>
          <p className="text-sm text-gray-400">Ai Medical Voice Agent</p>
          <div className="mt-12 px-10 md:px-28 lg:px-52 xl:px-72 flex flex-col items-center overflow-y-auto">
            {messages?.slice(-4).map((msg: messages, index) => (
              <h2 key={index} className="text-gray-400 p-2">
                {msg.role}: {msg.text}
              </h2>
            ))}
            {liveTranscript && liveTranscript?.length > 0 && (
              <h2 className="text-lg">
                {currentRoll}: {liveTranscript}
              </h2>
            )}
          </div>
          {!callStarted ? (
            <Button className="mt-2" onClick={StartCall}>
              <PhoneCall />
              Start Call
            </Button>
          ) : (
            <Button
              variant={'destructive'}
              onClick={endCall}
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : <PhoneOff />}
              Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default VoiceAgent;
