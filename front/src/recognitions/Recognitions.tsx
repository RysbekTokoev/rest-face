import * as React from 'react';
import PageTemplate from "../common/PageTemplate";
import Title from "../dashboard/Title";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { Recognition } from "../types/recognition.type";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Box from "@mui/system/Box";
import {TablePagination} from "@mui/material";

const URL = "http://127.0.0.1:8000/api/main/recognitions/";

interface Page {
  count: number;
  next: string | null;
  previous: string | null;
}

export function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString("RU", options);
}

const Recognitions = () => {
  const [rows, setRows]: [Recognition[], (rows: Recognition[]) => void] = React.useState<Recognition[]>([]);
  const [page, setPage]: [Page, (page: Page) => void] = React.useState<Page>({count: 0, next: null, previous: null });
  const [currentPage, setCurrentPage] = React.useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  React.useEffect(() => {
    axios
      .get(`${URL}?page=${currentPage + 1}`, {
        headers: {
          "Content-Type": "application/json"
        },
      }).then(response => {
        setRows(response.data.results);
        setPage(response.data);
      });
  }, [currentPage]);

  return (
    <PageTemplate>
      <Box maxWidth="75%" margin="auto"> {/* Limit the width of the entire content */}
        <Box mt={4} mb={4} mx={2}> {/* Add horizontal margin */}
          <Paper elevation={3}>
            <Box p={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Title>Распознования</Title>
                <TablePagination
                  component="div"
                  count={page.count}
                  page={currentPage}
                  onPageChange={handleChangePage}
                  rowsPerPage={20}
                  rowsPerPageOptions={[20]}
                />
              </Box>
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
                      <TableCell align="right">{formatDate(row.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={page.count}
                page={currentPage}
                onPageChange={handleChangePage}
                rowsPerPage={20}
                rowsPerPageOptions={[20]}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </PageTemplate>
  );
}

export default Recognitions;