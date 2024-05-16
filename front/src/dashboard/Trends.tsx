import * as React from 'react';
import { BarChart } from '@mui/x-charts';
import Title from './Title';
import axios from 'axios';

export default function Trends() {
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/main/recognitions/')
        .then(response => {
          const responseData = response.data.results;
          const groupedData: { [date: string]: { [emotion: string]: number } } = responseData.reduce((acc: any, item: any) => {
            const date = new Date(item.created_at).toISOString().slice(0, 10);
            if (!acc[date]) {
              acc[date] = {};
            }
            if (!acc[date][item.emotion]) {
              acc[date][item.emotion] = 0;
            }
            acc[date][item.emotion]++;
            return acc;
          }, {});

          const allEmotions: string[] = Array.from(new Set(responseData.map((item: any) => item.emotion)));
          const allDates = Object.keys(groupedData);

          const chartData = allEmotions.map((emotion: string) => {
            const data = allDates.map(date => groupedData[date][emotion] || 0);
            return { data, stack: 'emotions', label: emotion };
          });

          setData(chartData);
        });
    }, []);

  return (
    <React.Fragment>
      <Title>Emotion Trends</Title>
      <BarChart
        series={data}
        width={600}
        height={350}
      />
    </React.Fragment>
  );
}