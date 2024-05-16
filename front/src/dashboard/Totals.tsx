import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import axios from "axios";
import {formatDate} from "../recognitions/Recognitions";

interface TotalsProps {
    date: Date;
}

export default function Totals( {date}: TotalsProps ) {
    const [data, setData] = React.useState<any>([]);

    React.useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/main/recognitions/?start_date=' + date.toISOString().slice(0, 10))
            .then(response => {
                setData(response.data.count);
            });
    }, [date]);
  return (
    <React.Fragment>
      <Title>Всего распознаваний</Title>
      <Typography component="p" variant="h4">
          {data}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
          с {formatDate(date.toISOString(), false)}
      </Typography>
      <div>
        <Link color="primary" href="/recognitions">
          Все распознавания
        </Link>
      </div>
    </React.Fragment>
  );
}
