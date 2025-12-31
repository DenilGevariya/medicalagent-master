'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import moment from 'moment';
import { SessionDetail } from '../medical-agent/[sessionId]/page';

type SessionReport = {
  sessionId: string;
  agent: string;
  user: string;
  timestamp: string;
  chiefComplaint: string;
  summary: string;
  symptoms: string[];
  duration: string;
  severity: string;
  medicationsMentioned: string[];
  recommendations: string[];
};

type Props = {
  record: SessionDetail;
};

function ViewReportDialouge({ record }: Props) {
  if (!record.report) {
    // If no report is available, show a disabled button or message
    return (
      <Button variant="link" size="sm" disabled>
        No Report
      </Button>
    );
  }

  // Parse report if it's a string, or use it directly
  const report: SessionReport =
    typeof record.report === 'string'
      ? JSON.parse(record.report)
      : (record.report as unknown as SessionReport);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm">
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold mb-2">
            🏥 Medical AI Voice Agent Report
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-sm text-gray-500 text-center">
              Generated on{' '}
              {report.timestamp
                ? moment(report.timestamp).format('MMMM Do YYYY, h:mm A')
                : 'Unknown'}
            </div>
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Visit Info */}
        <section>
          <h2 className="font-semibold text-lg text-blue-600 mb-2">Visit Info</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p>
              <span className="font-medium">Doctor Specialization:</span>{' '}
              {record.selectedDoctor?.specialist || 'Not specified'}
            </p>
            <p>
              <span className="font-medium">Consult Date:</span>{' '}
              {moment(new Date(record.createdOn || report.timestamp)).fromNow()}
            </p>
            <p>
              <span className="font-medium">Agent:</span> {report.agent || 'Unknown'}
            </p>
            <p>
              <span className="font-medium">Patient Name:</span> {report.user || 'Anonymous'}
            </p>
          </div>
        </section>

        <Separator className="my-4" />

        {/* Complaint and Summary */}
        <section>
          <h2 className="font-semibold text-lg text-blue-600 mb-2">Case Summary</h2>
          <Card>
            <CardContent className="space-y-2 pt-4">
              <p>
                <span className="font-medium">Chief Complaint:</span>{' '}
                {report.chiefComplaint || 'No complaint provided.'}
              </p>
              <p>
                <span className="font-medium">Summary:</span> {report.summary || 'No summary available.'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <p>
                  <span className="font-medium">Duration:</span> {report.duration || 'Unknown'}
                </p>
                <p>
                  <span className="font-medium">Severity:</span> {report.severity || 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-4" />

        {/* Symptoms */}
        <section>
          <h2 className="font-semibold text-lg text-blue-600 mb-2">Reported Symptoms</h2>
          {report.symptoms && report.symptoms.length > 0 ? (
            <ul className="list-disc pl-6 space-y-1 text-sm">
              {report.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No specific symptoms reported.</p>
          )}
        </section>

        <Separator className="my-4" />

        {/* Medications */}
        <section>
          <h2 className="font-semibold text-lg text-blue-600 mb-2">Medications Mentioned</h2>
          {report.medicationsMentioned && report.medicationsMentioned.length > 0 ? (
            <ul className="list-disc pl-6 space-y-1 text-sm">
              {report.medicationsMentioned.map((med, index) => (
                <li key={index}>{med}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No medications mentioned.</p>
          )}
        </section>

        <Separator className="my-4" />

        {/* Recommendations */}
        <section>
          <h2 className="font-semibold text-lg text-blue-600 mb-2">AI Recommendations</h2>
          {report.recommendations && report.recommendations.length > 0 ? (
            <ul className="list-disc pl-6 space-y-1 text-sm">
              {report.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No recommendations available.</p>
          )}
        </section>

        <Separator className="my-4" />

        <p className="text-center text-xs text-gray-400">
          End of Report • Generated by Medical AI Assistant 🤖
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default ViewReportDialouge;
  