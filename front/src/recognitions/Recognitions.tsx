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


const URL = "http://127.0.0.1:8000/api/main/recognitions/?ordering=created_at&portal=1";
interface Recognition {
  id: number;
  name: string;
  email: string;
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

function Recognitions() {
  return (
  <PageTemplate>
    <React.Fragment>
      <Title>Недавние распознования</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Время</TableCell>
            <TableCell>Имя</TableCell>
            <TableCell>Камера</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/*{rows.map((row) => (*/}
          {/*  <TableRow key={row.id}>*/}
          {/*    <TableCell>{row.date}</TableCell>*/}
          {/*    <TableCell>{row.name}</TableCell>*/}
          {/*    <TableCell>{row.shipTo}</TableCell>*/}
          {/*    <TableCell>{row.paymentMethod}</TableCell>*/}
          {/*    <TableCell align="right">{`$${row.amount}`}</TableCell>*/}
          {/*  </TableRow>*/}
          {/*))}*/}
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