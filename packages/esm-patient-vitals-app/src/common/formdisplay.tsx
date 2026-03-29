import React from 'react';
import jsPDF from 'jspdf';

// formDefinition: parsed JSON form definition
// answers: { [questionId]: selectedValue }
export function FormDisplay({
  formDefinition,
  answers,
  showAllQuestions = false,
  respectVisibility = true,
}: {
  formDefinition: any;
  answers: Record<string, any>;
  showAllQuestions?: boolean;
  respectVisibility?: boolean;
}) {
  // Flatten all questions from all sections/pages, filter out domain/total score questions
  const questions: any[] = [];
  const hiddenLabels = [
    'Internalized stigma score',
    'HIV domain total score-Internalized stigma',
    'Mental health domain total score-Internalized stigma',
    'Sexual and Gender Minorities domain score-Internalized stigma',
    'Ethnic Minorities domain score-Internalized stigma',
    'Intersectional stigma score for Internalized stigma dimensions',
    'Enacted stigma score',
    'HIV domain total score-Enacted stigma',
    'Mental health domain total score-Enacted stigma',
    'Sexual and Gender Minorities domain score-Enacted stigma',
    'Ethnic Minorities domain score-Enacted stigma',
    'Intersectional stigma score for Enacted stigma dimensions',
    'Anticipated stigma score',
    'HIV domain total score- Anticipated stigma',
    'Mental health domain total score-Anticipated stigma',
    'Sexual and Gender Minorities domain score- Anticipated stigma',
    'Ethnic Minorities domain score- Anticipated stigma score',
    'Intersectional stigma score for Anticipated stigma',
  ];
  const allQuestions: any[] = [];
  formDefinition.pages.forEach((page: any) => {
    page.sections.forEach((section: any) => {
      section.questions.forEach((q: any) => {
        allQuestions.push(q);
      });
    });
  });

  const normalizeAnswerForQuestion = (q: any, rawValue: any) => {
    if (rawValue === undefined || rawValue === null) return rawValue;

    const answerOptions = q?.questionOptions?.answers || [];

    // Keep checkbox answers as an array of option concepts.
    if (Array.isArray(rawValue)) {
      return rawValue;
    }

    // For radio/select answers stored as option concept UUID, map to configured numeric value when present.
    const optionByConcept = answerOptions.find((opt: any) => opt?.concept === rawValue);
    if (optionByConcept && optionByConcept.value !== undefined && optionByConcept.value !== null) {
      return optionByConcept.value;
    }

    return rawValue;
  };

  const normalizedAnswersByQuestionId: Record<string, any> = {};
  allQuestions.forEach((q: any) => {
    normalizedAnswersByQuestionId[q.id] = normalizeAnswerForQuestion(q, answers[q.id]);
  });

  const evaluateHideExpression = (expression: string) => {
    try {
      // Form hide expressions reference question ids as variables; a Proxy avoids ReferenceError for missing ids.
      const scope = new Proxy(normalizedAnswersByQuestionId, {
        has: () => true,
        get: (target, prop) => target[String(prop)],
      });
      return Boolean(new Function('scope', `with (scope) { return (${expression}); }`)(scope));
    } catch {
      return false;
    }
  };

  allQuestions.forEach((q: any) => {
    const isHiddenByLabel = !showAllQuestions && hiddenLabels.includes(q.label);
    if (isHiddenByLabel) {
      return;
    }

    const rawAnswer = answers[q.id];
    const hasAnswer = Array.isArray(rawAnswer)
      ? rawAnswer.length > 0
      : rawAnswer !== undefined && rawAnswer !== null && rawAnswer !== '';

    // Always keep answered questions visible, even if hide expressions are currently true.
    if (hasAnswer) {
      questions.push(q);
      return;
    }

    const hideExpression = q?.hide?.hideWhenExpression;
    const isHiddenByFormLogic = respectVisibility && typeof hideExpression === 'string' && evaluateHideExpression(hideExpression);
    if (isHiddenByFormLogic) {
      return;
    }

    questions.push(q);
  });

  // Helper to get label for selected value
  function getAnswerLabel(q: any, value: any) {
    // Debug: log which questions have/don't have values
    // if (q.id && (value === undefined || value === null)) {
    //   console.log('Missing value for question:', q.id, q.label?.substring(0, 50));
    // } else if (q.id && value) {
    //   console.log('Has value for question:', q.id, value, q.label?.substring(0, 50));
    // }

    // If no value, return '-'
    if (value === undefined || value === null) return '-';

    const answerOptions = q?.questionOptions?.answers || [];
    const mapSingleValueToLabel = (singleValue: any) => {
      if (singleValue === undefined || singleValue === null) return undefined;

      // If value is concept UUID or coded concept from this question, show the configured label.
      const optionByConcept = answerOptions.find((opt: any) => opt?.concept === singleValue);
      if (optionByConcept?.label) return optionByConcept.label;

      // If value is numeric score and question options have value fields, map to matching option label.
      const optionByNumericValue = answerOptions.find(
        (opt: any) => opt?.value !== undefined && String(opt.value) === String(singleValue),
      );
      if (optionByNumericValue?.label) return optionByNumericValue.label;

      return singleValue;
    };

    // If value is an object with display, try to extract number from display string
    if (value && typeof value === 'object' && value.display) {
      const match = value.display.match(/: (\d+(\.\d+)?)/);
      if (match) return match[1];
      return value.display;
    }
    // If value is an array, deduplicate and join with comma
    if (Array.isArray(value)) {
      if (!value.length) return '-';
      // Map each selected value to this question's answer labels, then deduplicate.
      const uniqueValues = [...new Set(value.map(mapSingleValueToLabel))].filter(Boolean);
      return uniqueValues.join(', ');
    }
    // If value is a string or number, show as is
    return mapSingleValueToLabel(value);
  }

  // Download table as simple text PDF
  function handleDownloadPDF() {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text('Form Responses', 15, y);
    y += 10;
    doc.setFontSize(12);
    doc.text('Question', 15, y);
    doc.text('Selected Answer', 100, y);
    y += 8;
    questions.forEach((q) => {
      const question = String(q.label);
      const answer = String(getAnswerLabel(q, answers[q.id]));
      doc.text(question, 15, y);
      doc.text(answer, 100, y);
      y += 8;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save('form-responses.pdf');
  }

  return (
    <div style={{ padding: '16px' }}>
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
                Question
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
                Selected Answer
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
