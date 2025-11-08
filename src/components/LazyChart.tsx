import { lazy, Suspense } from 'react';

// 차트 라이브러리를 지연 로딩
const LazyChart = lazy(() => import('react-chartjs-2').then(module => ({
  default: module.Line
})));

interface ChartComponentProps {
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  options: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, options }) => {
  return (
    <Suspense fallback={
      <div className="w-full h-64 bg-white/5 rounded-lg flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full"></div>
      </div>
    }>
      <LazyChart data={data} options={options} />
    </Suspense>
  );
};

export default ChartComponent;