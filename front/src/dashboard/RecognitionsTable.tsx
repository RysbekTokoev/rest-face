import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import {Recognition} from "../types/recognition.type";
import axios from "axios";
import {formatDate} from "../recognitions/Recognitions";


export default function RecognitionsTable() {
  const [rows, setRows] = React.useState<Recognition[]>([]);


  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/main/recognitions/").then(response => {
        setRows(response.data.results.slice(0, 10));
    });
  }, []);

  return (
    <React.Fragment>
      <Title>Последнее</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Время</TableCell>
            <TableCell>Имя</TableCell>
            <TableCell>Камера</TableCell>
            <TableCell align={"right"}>Дата</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.face}</TableCell>
              <TableCell>{row.emotion}</TableCell>
              <TableCell>{row.camera}</TableCell>
              <TableCell align="right">{formatDate(row.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="/recognitions/" sx={{ mt: 3 }}>
        Все распознования
      </Link>
    </React.Fragment>
  );
}
