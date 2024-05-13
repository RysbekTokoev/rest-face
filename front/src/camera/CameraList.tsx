import * as React from "react";
import './App.scss';
import PageTemplate from "../common/PageTemplate";
import Title from "../dashboard/Title";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import axios from "axios";


interface ICamera {
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

const defaultCamera:ICamera[] = [];


const CameraList = () => {
    const [cameras, setCameras]: [ICamera[], (cameras: ICamera[]) => void] = React.useState(defaultCamera);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = React.useState("");

    React.useEffect(() => {
        axios
            .get<ICameraList>("http://127.0.0.1:8000/api/portal/camera/", {
              headers: {
                "Content-Type": "application/json"
              },
            }).then(response => {
                console.log(response.data);
              // setCameras(response.data.results);
              // setLoading(false);
            });
    }, []);

	return (
		<PageTemplate>
    <React.Fragment>
      <Title>Камеры</Title>
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
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  </PageTemplate>
	);
}; export default CameraList;