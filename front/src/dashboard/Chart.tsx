import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import { ChartsTextStyle } from '@mui/x-charts/ChartsText';
import Title from './Title';
import axios from "axios";
import {formatDate} from "../recognitions/Recognitions";



export default function Chart({date}: {date: Date}) {
  const theme = useTheme();
  const [data, setData] = React.useState<any>([]);
  const [max, setMax] = React.useState<number>(10);

  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/main/recognitions/chart/?start_date=" + date.toISOString().slice(0, 10)).then(response => {
        setData(response.data);
        setMax(response.data.reduce((acc: number, item: any) => Math.max(acc, item.count), 10));
    });
  }, [date]);

  return (
    <React.Fragment>
      <Title>По времени</Title>
      <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <LineChart
          dataset={data}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: 'point',
              dataKey: 'time',
              tickNumber: 2,
              tickLabelStyle: {display: 'none'},  // Hide x-axis labels
              valueFormatter: (value, context) => {
                return formatDate(value, true);
              },
            },
          ]}
          yAxis={[
            {
              label: 'Количество',
              labelStyle: {
                ...(theme.typography.body1 as ChartsTextStyle),
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2 as ChartsTextStyle,
              max: max,
              tickNumber: 3,
            },
          ]}
          series={[
            {
              dataKey: 'count',
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
            [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translateX(-25px)',
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
