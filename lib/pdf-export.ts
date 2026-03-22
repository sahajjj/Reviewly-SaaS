export async function exportReviewToPDF(review: any, code: string, language: string) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  let y = 20;

  // Title
  doc.setFontSize(22);
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text('Reviewly AI Report', 20, y);
  y += 10;

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Language: ${language} | Date: ${new Date().toLocaleString()}`, 20, y);
  y += 15;

  // Summary
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Summary of Findings', 20, y);
  y += 10;

  const counts = [
    { label: 'Bugs', count: review.bugs.length },
    { label: 'Improvements', count: review.improvements.length },
    { label: 'Security', count: review.security.length },
  ];

  doc.setFontSize(12);
  counts.forEach((item) => {
    doc.text(`- ${item.label}: ${item.count}`, 25, y);
    y += 7;
  });
  y += 5;

  // Bugs section
  if (review.bugs.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 38); // red-600
    doc.text('Bugs & Problems', 20, y);
    y += 8;
    review.bugs.forEach((bug: any) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(`• ${bug.title} (${bug.severity})`, 25, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(80);
      const splitExp = doc.splitTextToSize(bug.explanation, 160);
      doc.text(splitExp, 30, y);
      y += splitExp.length * 5 + 5;
    });
  }

  // Improvements section
  if (review.improvements.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setTextColor(217, 119, 6); // yellow-600
    doc.text('Improvements', 20, y);
    y += 8;
    review.improvements.forEach((imp: any) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(`• ${imp.title} (${imp.severity})`, 25, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(80);
      const splitExp = doc.splitTextToSize(imp.explanation, 160);
      doc.text(splitExp, 30, y);
      y += splitExp.length * 5 + 5;
    });
  }

  // Final Code segment (brief)
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('Analyzed Code (Snippet)', 20, y);
  y += 8;
  doc.setFontSize(8);
  doc.setFont('courier', 'normal');
  const codeSnippet = code.slice(0, 1000) + (code.length > 1000 ? '...' : '');
  const splitCode = doc.splitTextToSize(codeSnippet, 170);
  doc.text(splitCode, 20, y);

  doc.save(`reviewly-report-${Date.now()}.pdf`);
}
