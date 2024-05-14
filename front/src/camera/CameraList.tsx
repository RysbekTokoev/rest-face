import * as React from "react";
import PageTemplate from "../common/PageTemplate";
import Title from "../dashboard/Title";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import axios from "axios";
import {TablePagination} from "@mui/material";
import Box from "@mui/system/Box";
import Paper from "@mui/material/Paper";
import { Link as RouterLink } from 'react-router-dom';


export interface ICamera {
    id: number;
    name: string;
    status: string;
}

interface ICameraList {
    count: number;
    next: string;
    previous: string;
    results: ICamera[];
}

interface Page {
  count: number;
  next: string | null;
  previous: string | null;
}

const defaultCamera:ICamera[] = [];

const CameraList = () => {
    const [cameras, setCameras]: [ICamera[], (cameras: ICamera[]) => void] = React.useState(defaultCamera);
    const [page, setPage]: [Page, (page: Page) => void] = React.useState<Page>({count: 0, next: null, previous: null });
    const [currentPage, setCurrentPage] = React.useState(0);

    const handleChangePage = (event: unknown, newPage: number) => {
        setCurrentPage(newPage);
    };

    React.useEffect(() => {
        axios
            .get<ICameraList>(`http://127.0.0.1:8000/api/portal/camera/?page=${currentPage + 1}`, {
              headers: {
                "Content-Type": "application/json"
              },
            }).then(response => {
                setCameras(response.data.results);
                setPage(response.data);
            });
    }, [currentPage]);

    return (
        <PageTemplate>
            <Box maxWidth="75%" margin="auto">
                <Paper elevation={3}>
                    <Box mt={4} mb={4} mx={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Title>Камеры</Title>
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
                                    <TableCell>id</TableCell>
                                    <TableCell>Название</TableCell>
                                    <TableCell align="right">Статус</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cameras.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>
                                            <RouterLink to={`/camera/${row.id}/`}>
                                              {row.name}
                                            </RouterLink>
                                        </TableCell>
                                        <TableCell align="right">{row.status}</TableCell>
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

        </PageTemplate>
    );
};

export default CameraList;