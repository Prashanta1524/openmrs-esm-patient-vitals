import React from 'react';
import { aggregateStigmaByMonth, StigmaMonthlyMetrics } from './aggregation';

interface StigmaMonthlyViewProps {
  stigmaData: any[]; // Processed StigmaData from useCovidStigmaData hook
  startDate: Date;
  endDate: Date;
}

export function StigmaMonthlyView({ stigmaData, startDate, endDate }: StigmaMonthlyViewProps) {
  const metrics = aggregateStigmaByMonth(stigmaData, startDate, endDate);

  if (metrics.length === 0) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
        No stigma data available for the selected date range.
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', overflowX: 'auto' }}>
      <h3 style={{ marginBottom: '1rem', color: '#1e3a8a' }}>
        📊 Monthly Stigma Metrics - Above/Below Cutoff Analysis
      </h3>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9rem',
          minWidth: '800px',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f0f4f8', borderBottom: '2px solid #cbd5e0' }}>
            <th style={headerStyle} rowSpan={2}>
              Month
            </th>
            <th style={headerStyle} colSpan={3}>
              Stigma Types
            </th>
            <th style={headerStyle} colSpan={2}>
              Dimensions
            </th>
            <th style={headerStyle} colSpan={2}>
              Intersectional
            </th>
            <th style={headerStyle} colSpan={4}>
              Dimension Details
            </th>
          </tr>
          <tr style={{ backgroundColor: '#f0f4f8', borderBottom: '2px solid #cbd5e0' }}>
            {/* Stigma Types */}
            <th style={subHeaderStyle}>AS</th>
            <th style={subHeaderStyle}>ES</th>
            <th style={subHeaderStyle}>IS</th>
            {/* Dimensions */}
            <th style={{ ...subHeaderStyle, color: '#dc2626' }}>Above</th>
            <th style={{ ...subHeaderStyle, color: '#2563eb' }}>Below</th>
            {/* Intersectional */}
            <th style={{ ...subHeaderStyle, color: '#dc2626' }}>Above</th>
            <th style={{ ...subHeaderStyle, color: '#2563eb' }}>Below</th>
            {/* Dimension Details */}
            <th style={subHeaderStyle}>HIV</th>
            <th style={subHeaderStyle}>MH</th>
            <th style={subHeaderStyle}>SGM</th>
            <th style={subHeaderStyle}>EM</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m, idx) => (
            <tr
              key={m.sortKey}
              style={{
                backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <td style={cellStyle}>
                <strong>{m.month}</strong>
              </td>
              {/* Stigma Types */}
              <td style={cellStyle}>{m.anticipatedCount}</td>
              <td style={cellStyle}>{m.enactedCount}</td>
              <td style={cellStyle}>{m.internalizedCount}</td>
              {/* Dimensions */}
              <td style={{ ...cellStyle, color: '#dc2626', fontWeight: 'bold' }}>{m.dimensionsAboveCutoff}</td>
              <td style={{ ...cellStyle, color: '#2563eb', fontWeight: 'bold' }}>{m.dimensionsBelowCutoff}</td>
              {/* Intersectional */}
              <td style={{ ...cellStyle, color: '#dc2626', fontWeight: 'bold' }}>{m.intersectionalAboveCutoff}</td>
              <td style={{ ...cellStyle, color: '#2563eb', fontWeight: 'bold' }}>{m.intersectionalBelowCutoff}</td>
              {/* Dimension Details */}
              <td style={cellStyle}>{m.hivAboveCutoff}</td>
              <td style={cellStyle}>{m.mhAboveCutoff}</td>
              <td style={cellStyle}>{m.sgmAboveCutoff}</td>
              <td style={cellStyle}>{m.emAboveCutoff}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: '#e0f2fe', borderTop: '2px solid #cbd5e0', fontWeight: 'bold' }}>
            <td style={cellStyle}>TOTAL</td>
            {/* Stigma Types */}
            <td style={cellStyle}>{metrics.reduce((sum, m) => sum + m.anticipatedCount, 0)}</td>
            <td style={cellStyle}>{metrics.reduce((sum, m) => sum + m.enactedCount, 0)}</td>
            <td style={cellStyle}>{metrics.reduce((sum, m) => sum + m.internalizedCount, 0)}</td>
            {/* Dimensions */}
            <td style={{ ...cellStyle, color: '#dc2626' }}>
              {metrics.reduce((sum, m) => sum + m.dimensionsAboveCutoff, 0)}
            </td>
            <td style={{ ...cellStyle, color: '#2563eb' }}>
              {metrics.reduce((sum, m) => sum + m.dimensionsBelowCutoff, 0)}
            </td>
            {/* Intersectional */}
            <td style={{ ...cellStyle, color: '#dc2626' }}>
              {metrics.reduce((sum, m) => sum + m.intersectionalAboveCutoff, 0)}
            </td>
            <td style={{ ...cellStyle, color: '#2563eb' }}>
              {metrics.reduce((sum, m) => sum + m.intersectionalBelowCutoff, 0)}
            </td>
            {/* Dimension Details */}
            <td style={cellStyle}>{metrics.reduce((sum, m) => sum + m.hivAboveCutoff, 0)}</td>
            <td style={cellStyle}>{metrics.reduce((sum, m) => sum + m.mhAboveCutoff, 0)}</td>
            <td style={cellStyle}>{metrics.reduce((sum, m) => sum + m.sgmAboveCutoff, 0)}</td>
            <td style={cellStyle}>{metrics.reduce((sum, m) => sum + m.emAboveCutoff, 0)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Legend */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#374151' }}>📖 Legend:</h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '0.5rem',
            fontSize: '0.85rem',
          }}
        >
          <div>
            <strong>AS:</strong> Anticipated Stigma (अपेक्षित लान्छना)
          </div>
          <div>
            <strong>ES:</strong> Enacted Stigma (व्यावहारिक लान्छना)
          </div>
          <div>
            <strong>IS:</strong> Internalized Stigma (आत्मलान्छना)
          </div>
          <div>
            <strong>HIV:</strong> HIV-related stigma
          </div>
          <div>
            <strong>MH:</strong> Mental Health stigma
          </div>
          <div>
            <strong>SGM:</strong> Sexual/Gender Minority stigma
          </div>
          <div>
            <strong>EM:</strong> Ethnic Minority stigma
          </div>
          <div style={{ color: '#dc2626' }}>
            <strong>Above:</strong> Score ≥ cutoff (needs intervention)
          </div>
          <div style={{ color: '#2563eb' }}>
            <strong>Below:</strong> Score &lt; cutoff (okay)
          </div>
        </div>
      </div>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  padding: '0.75rem 0.5rem',
  textAlign: 'center',
  fontWeight: 'bold',
  color: '#1e3a8a',
  fontSize: '0.9rem',
};

const subHeaderStyle: React.CSSProperties = {
  padding: '0.5rem 0.25rem',
  textAlign: 'center',
  fontWeight: '600',
  fontSize: '0.8rem',
  color: '#4b5563',
};

const cellStyle: React.CSSProperties = {
  padding: '0.5rem',
  textAlign: 'center',
  fontSize: '0.85rem',
};
