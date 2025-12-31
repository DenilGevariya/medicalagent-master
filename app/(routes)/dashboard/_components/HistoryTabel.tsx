import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SessionDetail } from '../medical-agent/[sessionId]/page';
import { Button } from '@/components/ui/button';
import moment from 'moment'
import ViewReportDialouge from './ViewReportDialouge';
type Props = {
  historyList: SessionDetail[];
};
function HistoryTabel({ historyList }: Props) {
  return (
    <div>
      <Table>
        <TableCaption>Previous Consultation Reports</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">AI Medical Specialist</TableHead>
            <TableHead className='w-[200px]'>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyList.map((record: SessionDetail, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{record.selectedDoctor?.specialist}</TableCell>
              <TableCell>{record.notes}</TableCell>
              <TableCell>{moment(new Date(record.createdOn)).fromNow()}</TableCell>
              <TableCell className="text-right"><ViewReportDialouge record={record}/></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default HistoryTabel;
