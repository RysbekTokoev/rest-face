import * as React from 'react';
import PageTemplate from "../common/PageTemplate";
import Title from "../dashboard/Title";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Link from "@mui/material/Link";
import axios from "axios";


const URL = "http://127.0.0.1:8000/api/main/recognitions/";
interface Recognition {
  id: number;
  face: string;
  emotion: string;
  camera: string;
  created_at: string;
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

const Recognitions = () => {
  const [rows, setRows]: [Recognition[], (rows: Recognition[]) => void] = React.useState<Recognition[]>([]);


  React.useEffect(() => {
    axios
      .get(URL, {
        headers: {
          "Content-Type": "application/json"
        },
      }).then(response => {
        setRows(response.data.results);
      });
  }, []);

  return (
  <PageTemplate>
    <React.Fragment>
      <Title>Недавние распознования</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Имя</TableCell>
            <TableCell>Камера</TableCell>
            <TableCell>Эмоция</TableCell>
            <TableCell align="right">Время</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.face}</TableCell>
              <TableCell>{row.camera}</TableCell>
              <TableCell>{row.emotion}</TableCell>
              <TableCell align="right">{row.created_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        Все распознования
      </Link>
    </React.Fragment>
  </PageTemplate>
  );
}

export default Recognitions;