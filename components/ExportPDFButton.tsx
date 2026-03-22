'use client';

import React from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportPDFButtonProps {
  review: any;
  code: string;
  language: string;
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ review, code, language }) => {
  const handleExport = async () => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf' });
      const { exportReviewToPDF } = await import('@/lib/pdf-export');
      await exportReviewToPDF(review, code, language);
      toast.success('PDF saved!', { id: 'pdf', style: { background: '#18181b', color: '#fafafa', border: '1px solid #27272a' } });
    } catch {
      toast.error('PDF failed.', { id: 'pdf' });
    }
  };

  return (
    <button className="btn-export" onClick={handleExport}>
      <Download style={{ width: 12, height: 12 }} />
      Export PDF
    </button>
  );
};

export default ExportPDFButton;
