import * as React from 'react';
import {PieChart} from '@mui/x-charts';
import Title from './Title';
import axios from 'axios';

export default function CircleEmotions( {date}: {date: Date}) {
  const [data, setData] = React.useState([{data: []}]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/main/recognitions/circle_emotion/?start_date=' + date.toISOString().slice(0, 10))
      .then(response => {
        const responseData = response.data;
        const labels = responseData.map((item: any) => item.emotion);
        const counts = responseData.map((item: any) => item.count);

        const seriesData = [{data: labels.map((label: string, index: number) => ({ id: index, label: label, value: counts[index] }))}];
        setData(seriesData);
        setLoading(false);
      });
  }, [date]);

  return (
    <React.Fragment>
      <Title>Emotion Chart</Title>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          data && data.length > 0 ? (
            <PieChart
              series={data}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Emotion Chart'
                  }
                }
              }}
              height={200}
            />
          ) : (
            <div>No data available</div>
          )
        )}
      </div>
    </React.Fragment>
  );
}