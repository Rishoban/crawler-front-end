import './chartjs-setup';
import { Pie } from 'react-chartjs-2';

export default function ChartLinks({ internal, external }: { internal: number; external: number }) {
  const isEmpty = internal === 0 && external === 0;
  const data = {
    labels: ['Internal', 'External'],
    datasets: [
      {
        data: isEmpty ? [1, 1] : [internal, external],
        backgroundColor: ['#e0e0e0', '#bdbdbd'],
        // Use gray colors for empty
      },
    ],
  };
  return (
    <div style={{ maxWidth: 240, margin: '0 auto', textAlign: 'center' }}>
      <Pie data={data} />
      {isEmpty && <div style={{ color: '#888', marginTop: 8 }}>No link data</div>}
    </div>
  );
}
