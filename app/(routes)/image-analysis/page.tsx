'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AnalysisResult {
  condition: string;
  severity: string;
  symptoms: string[];
  possibleCauses: string[];
  recommendations: string[];
  urgencyLevel: string;
  disclaimer: string;
}

export default function ImageAnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysis(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        const result = await axios.post('/api/image-analysis', {
          image: base64Image,
          fileName: selectedImage.name,
        });
        
        setAnalysis(result.data);
        setLoading(false);
      };
      
      reader.onerror = () => {
        setLoading(false);
        alert('Error reading image file');
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      setLoading(false);
      alert('Failed to analyze image. Please try again.');
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => router.push('/')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">AI Health Image Analysis</CardTitle>
          <CardDescription>
            Upload a photograph to analyze health issues better. 
            The AI will provide insights about skin conditions, wounds, rashes, or other visible health concerns.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Upload Section */}
          {!previewUrl && (
            <div 
              onClick={handleUploadClick}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Click to upload an image
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, JPEG up to 10MB
                </p>
              </div>
            </div>
          )}

          {/* Preview Section */}
          {previewUrl && !analysis && (
            <div className="space-y-4">
              <div className="relative w-full h-96 border rounded-lg overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Selected image"
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Image'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              <div className="relative w-full h-64 border rounded-lg overflow-hidden mb-4">
                <Image
                  src={previewUrl}
                  alt="Analyzed image"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Condition Identified</h3>
                  <p className="text-gray-700">{analysis.condition}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Severity Level</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    analysis.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                    analysis.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {analysis.severity}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Urgency Level</h3>
                  <p className="text-gray-700">{analysis.urgencyLevel}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Symptoms Observed</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.symptoms.map((symptom, idx) => (
                      <li key={idx} className="text-gray-700">{symptom}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Possible Causes</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.possibleCauses.map((cause, idx) => (
                      <li key={idx} className="text-gray-700">{cause}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>⚠️ Disclaimer:</strong> {analysis.disclaimer}
                  </p>
                </div>

                <Button onClick={handleReset} variant="outline" className="w-full">
                  Analyze Another Image
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
