import * as React from 'react';
import { BarChart } from '@mui/x-charts';
import Title from './Title';
import axios from 'axios';

export default function Trends() {
  const [data, setData] = React.useState<any[]>([]);
  const [dates, setDates] = React.useState<string[]>([]);

  React.useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/main/recognitions/all')
        .then(response => {
          const responseData = response.data;
          const groupedData: { [date: string]: { [emotion: string]: number } } = responseData.reduce((acc: any, item: any) => {
            const date = item.created_at.slice(0, 10);
            console.log(date);
            if (!acc[date]) {
              acc[date] = {};
            }
            if (item.emotion !== 'neutral') {
                if (!acc[date][item.emotion]) {
                    acc[date][item.emotion] = 0;
                }
                acc[date][item.emotion]++;
            }
            return acc;
          }, {});

          const allEmotions: string[] = Array.from(new Set(responseData.map((item: any) => item.emotion)));
          const allDates = Object.keys(groupedData);

          console.log(groupedData)
          const chartData = allEmotions.map((emotion: string) => {
            const data = allDates.map(date => groupedData[date][emotion] || 0);
            return { data, stack: 'emotions', label: emotion};
          });

          setDates(allDates);
          setData(chartData);
        });
    }, []);

  return (
    <React.Fragment>
      <Title>Emotion Trends</Title>
      <BarChart
        series={data}
        xAxis={[{ scaleType: 'band', data: dates }]}
        width={500}
        height={200}
        slotProps={{
            legend: {
              hidden: true
            },
      }}
      />
    </React.Fragment>
  );
}