import React from 'react';

type CountsByDay = Record<number, number>; // day -> count

function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: number[][] = [];
  let week: number[] = Array(startDay).fill(0);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(0);
    weeks.push(week);
  }
  return weeks;
}

export default function DateCountCalendar({
  year,
  month,
  counts,
  onMonthChange,
}: {
  year: number;
  month: number; // 0-11
  counts: CountsByDay;
  onMonthChange?: (year: number, month: number) => void;
}) {
  const weeks = monthMatrix(year, month);

  const prev = () => onMonthChange && onMonthChange(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
  const next = () => onMonthChange && onMonthChange(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 420,
        background: '#fff',
        borderRadius: 8,
        padding: 12,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <button onClick={prev} style={{ padding: '6px 10px' }}>
          {'<'}
        </button>
        <strong>{new Date(year, month, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' })}</strong>
        <button onClick={next} style={{ padding: '6px 10px' }}>
          {'>'}
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 12, color: '#666' }}>
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {weeks.flat().map((day, idx) => (
          <div
            key={idx}
            style={{
              minHeight: 54,
              borderRadius: 6,
              background: day ? '#f7f9fb' : 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
            }}
          >
            {day ? (
              <>
                <div style={{ fontWeight: 600 }}>{day}</div>
                <div style={{ fontSize: 12, color: '#1f2e5b' }}>{counts[day] ?? 0}</div>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
