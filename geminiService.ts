
import { MasterResume } from './types';

export async function parseResumeFromPdf(file: File): Promise<MasterResume> {
  // Convert File to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  try {
    const response = await fetch('/api/parse-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileData: base64Data,
        mimeType: 'application/pdf',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to parse resume');
    }

    return await response.json() as MasterResume;
  } catch (error: any) {
    console.error('Error calling parse-resume API:', error);
    throw new Error(error.message || 'Failed to parse resume');
  }
}
