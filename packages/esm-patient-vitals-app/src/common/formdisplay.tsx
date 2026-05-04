import React from 'react';
import jsPDF from 'jspdf';

export function FormDisplay({
  formDefinition,
  answers,
  showAllQuestions = false,
  respectVisibility = true,
  questionIdToConceptMap = {},
}: {
  formDefinition: any;
  answers: Record<string, any>;
  showAllQuestions?: boolean;
  respectVisibility?: boolean;
  questionIdToConceptMap?: Record<string, string>;
}) {
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

  // 🔹 Flatten questions
  const allQuestions: any[] = [];
  formDefinition.pages.forEach((page: any) => {
    page.sections.forEach((section: any) => {
      section.questions.forEach((q: any) => {
        allQuestions.push(q);
      });
    });
  });

  // 🔹 Resolve the key used in `answers` for a given questionId
  const getAnswerKey = (questionId: string): string => {
    return questionIdToConceptMap[questionId] ?? questionId;
  };

  // 🔹 Normalize answers
  const normalizeAnswerForQuestion = (q: any, rawValue: any) => {
    if (rawValue === undefined || rawValue === null) return rawValue;

    const answerOptions = q?.questionOptions?.answers || [];

    if (Array.isArray(rawValue)) return rawValue;

    const optionByConcept = answerOptions.find(
      (opt: any) => opt?.concept === rawValue
    );

    if (optionByConcept?.value !== undefined) {
      return optionByConcept.value;
    }

    return rawValue;
  };

  // 🔹 Build normalized answers using mapped concept UUID for lookup
  const normalizedAnswersByQuestionId: Record<string, any> = {};
  allQuestions.forEach((q: any) => {
    const answerKey = getAnswerKey(q.id); // resolve to conceptUUID if mapped
    normalizedAnswersByQuestionId[q.id] = normalizeAnswerForQuestion(
      q,
      answers[answerKey] // fetch from answers using UUID
    );
  });

  // 🔹 Evaluate visibility
  const evaluateHideExpression = (expression: string) => {
    try {
      const scope = new Proxy(normalizedAnswersByQuestionId, {
        has: () => true,
        get: (target, prop) => target[String(prop)],
      });
      return Boolean(
        new Function('scope', `with (scope) { return (${expression}); }`)(scope)
      );
    } catch {
      return false;
    }
  };

  // 🔹 Filter questions
  const questions: any[] = [];

  allQuestions.forEach((q: any) => {
    const isHiddenByLabel =
      !showAllQuestions && hiddenLabels.includes(q.label);

    if (isHiddenByLabel) return;

    const value = normalizedAnswersByQuestionId[q.id];

    const hasAnswer = Array.isArray(value)
      ? value.length > 0
      : value !== undefined && value !== null && value !== '';

    if (hasAnswer) {
      questions.push(q);
      return;
    }

    const hideExpression = q?.hide?.hideWhenExpression;

    const isHiddenByFormLogic =
      respectVisibility &&
      typeof hideExpression === 'string' &&
      evaluateHideExpression(hideExpression);

    if (!isHiddenByFormLogic) {
      questions.push(q);
    }
  });

  // 🔹 Get label
  function getAnswerLabel(q: any, value: any) {
    if (value === undefined || value === null) return '-';

    const answerOptions = q?.questionOptions?.answers || [];

    const mapValue = (val: any) => {
      const byConcept = answerOptions.find(
        (opt: any) => opt?.concept === val
      );
      if (byConcept?.label) return byConcept.label;

      const byValue = answerOptions.find(
        (opt: any) =>
          opt?.value !== undefined &&
          String(opt.value) === String(val)
      );
      if (byValue?.label) return byValue.label;

      return val;
    };

    if (Array.isArray(value)) {
      const unique = [...new Set(value.map(mapValue))].filter(Boolean);
      return unique.join(', ');
    }

    if (typeof value === 'object' && value?.display) {
      return value.display;
    }

    return mapValue(value);
  }

  // 🔹 PDF export
  function handleDownloadPDF() {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text('Form Responses', 15, y);
    y += 10;

    doc.setFontSize(12);
    doc.text('Question', 15, y);
    doc.text('Answer', 100, y);
    y += 8;

    questions.forEach((q) => {
      const question = String(q.label);
      const answer = String(
        getAnswerLabel(q, normalizedAnswersByQuestionId[q.id])
      );

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
      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Download PDF
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderSpacing: '0 8px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>
                Question
              </th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>
                Selected Answer
              </th>
            </tr>
          </thead>

          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                  {q.label}
                </td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                  {getAnswerLabel(q, normalizedAnswersByQuestionId[q.id])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}