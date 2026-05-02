import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lang = 'he' } = await req.json();
    
    const guides = {
      he: {
        title: 'מדריך משתמש',
        welcome: 'שלום',
        prereqTitle: 'דרישות מקדימות',
        stepsTitle: 'שלבי הגדרה',
        tipsTitle: 'טיפים',
        prereqs: [
          { title: 'חיבור Noga', body: 'חיבור נתונים מהמונה שלך מול Noga ISO' },
          { title: 'חיבור SolarEdge', body: 'הוספת API Key של SolarEdge לצפייה בייצור חשמל' },
          { title: 'הוספת כרטיס אשראי', body: 'הכרחי לקבלת תשלומים על אנרגיה שנמכרת' }
        ],
        steps: [
          { title: 'הגדרת פרופיל', desc: 'עדכן את הפרטים האישיים שלך' },
          { title: 'חיבור המערכות', desc: 'חבר את כל ה-APIs הדרושים' },
          { title: 'הגדרת לוח בקרה', desc: 'התאם את ההגדרות לפי הצרכים שלך' }
        ],
        tips: [
          'בדוק נתונים כל יום בבוקר',
          'התחל בסימולציה לפני מצב חי',
          'עקוב אחר הכנסות שלך בדוח חודשי'
        ]
      },
      en: {
        title: 'User Guide',
        welcome: 'Hello',
        prereqTitle: 'Prerequisites',
        stepsTitle: 'Setup Steps',
        tipsTitle: 'Tips',
        prereqs: [
          { title: 'Connect Noga', body: 'Connect your meter data with Noga ISO' },
          { title: 'Connect SolarEdge', body: 'Add SolarEdge API Key to see power generation' },
          { title: 'Add Credit Card', body: 'Required to receive payments for sold energy' }
        ],
        steps: [
          { title: 'Setup Profile', desc: 'Update your personal details' },
          { title: 'Connect Systems', desc: 'Connect all required APIs' },
          { title: 'Configure Dashboard', desc: 'Adjust settings to your needs' }
        ],
        tips: [
          'Check data every morning',
          'Start with simulation before live mode',
          'Track your income in monthly reports'
        ]
      }
    };

    const g = guides[lang] || guides.he;
    const userName = user?.full_name || (lang === 'he' ? 'משתמש יקר' : 'Valued User');

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 15;

    // Hero section
    doc.setFillColor(16, 185, 129);
    doc.rect(10, yPosition, pageWidth - 20, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('VPP Solar Club', pageWidth / 2, yPosition + 12, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`${g.welcome} ${userName} 👋`, pageWidth / 2, yPosition + 21, { align: 'center' });

    yPosition += 40;

    // Prerequisites
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text(g.prereqTitle, 15, yPosition);
    yPosition += 8;

    g.prereqs.forEach(p => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 15;
      }

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`${p.title}`, 15, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const bodyLines = doc.splitTextToSize(p.body, pageWidth - 30);
      doc.text(bodyLines, 20, yPosition);
      yPosition += bodyLines.length * 3.5 + 3;
    });

    // Steps
    yPosition += 3;
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 15;
    }

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text(g.stepsTitle, 15, yPosition);
    yPosition += 8;

    g.steps.forEach((s, idx) => {
      if (yPosition > pageHeight - 25) {
        doc.addPage();
        yPosition = 15;
      }

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`${idx + 1}. ${s.title}`, 15, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const descLines = doc.splitTextToSize(s.desc, pageWidth - 30);
      doc.text(descLines, 20, yPosition);
      yPosition += descLines.length * 3.5 + 3;
    });

    // Tips
    yPosition += 3;
    if (yPosition > pageHeight - 35) {
      doc.addPage();
      yPosition = 15;
    }

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text(g.tipsTitle, 15, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    g.tips.forEach(tip => {
      if (yPosition > pageHeight - 15) {
        doc.addPage();
        yPosition = 15;
      }
      const tipLines = doc.splitTextToSize(`✦ ${tip}`, pageWidth - 30);
      doc.text(tipLines, 20, yPosition);
      yPosition += tipLines.length * 3.5 + 2;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('VPP Solar Club © 2026 · support@vppsolarclub.com', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Return as base64
    const pdfBase64 = doc.output('datauristring').split(',')[1];
    
    return Response.json({
      success: true,
      pdf: pdfBase64,
      filename: `VPP_Solar_Club_${lang === 'he' ? 'מדריך' : 'Guide'}.pdf`
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});