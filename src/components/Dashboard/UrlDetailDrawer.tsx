import ChartLinks from './ChartLinks';

export default function UrlDetailDrawer({ url, chartData, linksData, loading, onClose }: {
  url: any,
  chartData?: { internal: number; external: number },
  linksData?: { url: string; status: number }[],
  loading?: boolean,
  onClose: () => void
}) {
  if (!url) return null;
  return (
    <div
      style={{
        maxWidth: 900,
        margin: '0 auto',
        background: '#fff',
        padding: 24,
        borderRadius: 12,
        boxShadow: '0 2px 16px #eee',
      }}
    >
      <button onClick={onClose} style={{ marginBottom: 24 }}>&larr; Back to Table</button>
      <h3 style={{ marginBottom: 32 }}>{url.url}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 32,
          alignItems: 'start',
        }}
      >
        {/* Broken Links List */}
        <div
          style={{
            minWidth: 220,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <b style={{ marginBottom: 12 }}>Broken Links:</b>
          {loading ? (
            <div>Loading links...</div>
          ) : (
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {linksData && linksData.length > 0 ? (
                linksData.map((l, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>{l.url} <span style={{ color: '#d32f2f' }}>({l.status})</span></li>
                ))
              ) : (
                <li>No broken links</li>
              )}
            </ul>
          )}
        </div>
        {/* Pie Chart */}
        <div
          style={{
            minWidth: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <b style={{ marginBottom: 12 }}>Internal vs. External Links</b>
          {loading ? (
            <div>Loading chart...</div>
          ) : chartData ? (
            <ChartLinks
              key={url.id + '-' + chartData.internal + '-' + chartData.external}
              internal={chartData.internal}
              external={chartData.external}
            />
          ) : null}
        </div>
      </div>
      {/* Responsive style: stack on mobile */}
      <style>{`
        @media (max-width: 700px) {
          div[role='detail-flex'], div[style*='grid-template-columns'] {
            display: flex !important;
            flex-direction: column !important;
            gap: 0 !important;
          }
          div[role='detail-flex'] > div, div[style*='grid-template-columns'] > div {
            margin-bottom: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
