import React from 'react';
import jsPDF from 'jspdf';

// conferenceformdisplay: similar to FormDisplay but labeled for the conference form
export function ConferenceFormDisplay({
  formDefinition,
  answers,
}: {
  formDefinition: any;
  answers: Record<string, any>;
}) {
  const questions: any[] = [];

  // Collect all questions (no hidden label filtering) so the conference form displays every question
  formDefinition.pages.forEach((page: any) => {
    page.sections.forEach((section: any) => {
      section.questions.forEach((q: any) => {
        questions.push(q);
      });
    });
  });

  function getAnswerLabel(q: any, value: any) {
    if (value === undefined || value === null) return '-';
    if (value && typeof value === 'object' && value.display) {
      const match = value.display.match(/: (\d+(\.\d+)?)/);
      if (match) return match[1];
      return value.display;
    }
    if (Array.isArray(value)) {
      return value.length ? value.join(', ') : '-';
    }
    return value;
  }

  // function handleDownloadPDF() {
  //   const doc = new jsPDF();
  //   let y = 20;
  //   doc.setFontSize(16);
  //   doc.text('कन्फरेन्स फारम - उत्तरहरू', 15, y);
  //   y += 10;
  //   doc.setFontSize(12);
  //   doc.text('प्रश्न', 15, y);
  //   doc.text('उत्तर', 100, y);
  //   y += 8;
  //   questions.forEach((q) => {
  //     const question = String(q.label);
  //     const answer = String(getAnswerLabel(q, answers[q.id]));
  //     doc.text(question, 15, y);
  //     doc.text(answer, 100, y);
  //     y += 8;
  //     if (y > 280) {
  //       doc.addPage();
  //       y = 20;
  //     }
  //   });
  //   doc.save('conference-form-responses.pdf');
  // }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.3em' }}>कन्फरेन्स फारम - उत्तरहरू</h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', background: '#fafafa' }}>
          <thead>
            <tr>
              <th
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  fontWeight: 'bold',
                  background: '#f5f5f5',
                  fontSize: '1em',
                }}
              >
                प्रश्न
              </th>
              <th
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  fontWeight: 'bold',
                  background: '#f5f5f5',
                  fontSize: '1em',
                }}
              >
                उत्तर
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    background: '#fff',
                    verticalAlign: 'top',
                    minWidth: 180,
                  }}
                >
                  {q.label}
                </td>
                <td
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    background: '#fff',
                    verticalAlign: 'top',
                    minWidth: 120,
                  }}
                >
                  {getAnswerLabel(q, answers[q.id])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ConferenceFormDisplay;
