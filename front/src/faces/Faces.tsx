import * as React from 'react';
import PageTemplate from "../common/PageTemplate";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Switch,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Card, CardMedia, CardContent, InputLabel, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/system';
import axios from "axios";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface Face {
  id: number;
  username: string;
  // lastRecognized: string;
  image: string;
}

const Faces = () => {
  const [faces, setFaces] = React.useState<Face[]>([]);
  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [notify, setNotify] = React.useState(false);
  const [selectedFace, setSelectedFace] = React.useState<Face | null>(null);
  const [image, setImage] = React.useState<File | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>("/person.jpg");
  const [note, setNote] = React.useState("");
  const [editMode, setEditMode] = React.useState(false);

  const handleClickOpen = async (face: Face | null) => {
    if (face) {
      setUsername(face.username);
      setPreviewImage(face.image);
      // set other form fields...

      // Fetch image from URL and create a File object
      // Fetch image from URL and create a File object
      const response = await fetch(face.image);
      const blob = await response.blob();
      const file = new File([blob], `${face.username}.jpg`, { type: blob.type });
      setImage(file);

      setEditMode(true);
    } else {
      setUsername("");
      setPreviewImage("/person.jpg");
      // clear other form fields...
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPreviewImage(null);
    setEditMode(false);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('note', note);
    formData.append('to_notify', notify.toString());
    if (image) {
      formData.append('image', image);
    }

    if (editMode) {
      axios.patch(`http://127.0.0.1:8000/api/main/faces/${selectedFace?.id}/`, formData)
    } else {
      axios.post("http://127.0.0.1:8000/api/main/faces/", formData)
    }
    handleClose();
  };


  React.useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/main/faces/").then(response => {
      setFaces(response.data.results);
    });
  }, [open]);

  const handleToggle = () => {
    setNotify(!notify);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
  <PageTemplate>
    <Grid container spacing={2} marginTop={3  }>
      <Grid item xs={1}></Grid> {/* 5% space */}
      <Grid item xs={6}> {/* 50% table container */}
        <Box maxWidth="md" margin="auto" id="parent">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}> {/* Increase mb value */}
            <h2>Faces</h2>
          </Box>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Last Recognized Time</TableCell>
                  <TableCell style={{ width: '1%' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleClickOpen(null)}
                      sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
                    >
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <AddIcon />
                      </Box>
                    </Button>
                  </TableCell> {/* Add style prop */}
                </TableRow>
              </TableHead>
              <TableBody>
                {faces.map((face) => (
                  <TableRow key={face.id} onClick={() => setSelectedFace(face)}>
                    <TableCell>{face.id}</TableCell>
                    <TableCell>{face.username}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        startIcon={<EditIcon />}
                        size="small"
                        onClick={() => handleClickOpen(face)}
                      >
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{editMode? "Edit": "Add"}</DialogTitle>
            <CardMedia
              component="img"
              height="360"
              image={previewImage ? previewImage : "/path/to/placeholder.jpg"}
              alt={previewImage ? "Preview" : "Placeholder"}
              sx={{
                objectFit: 'contain',
                backgroundColor: 'white',
              }}
            />
            <DialogContent>
              <TextField autoFocus margin="dense" id="username" label="Username" type="text" fullWidth variant="standard" value={username} onChange={(e) => setUsername(e.target.value)} />
              <TextField margin="dense" id="note" label="Note" type="text" fullWidth variant="standard" value={note} onChange={(e) => setNote(e.target.value)} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  <InputLabel>Уведомлять о человеке</InputLabel>
                  <Tooltip title="Уведомления приходят на портал и на почту, указанную в настройках">
                    <IconButton>
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <FormControlLabel
                  control={<Switch checked={notify} onChange={handleToggle} />}
                  label=""
                />
              </Box>
              <Box display="flex" justifyContent="center" marginTop={2}>
                <Button variant="contained" component="label">
                  Upload Image
                  <input type="file" hidden onChange={handleImageChange} />
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box maxWidth="md" margin="auto" id="detail" marginTop="40px">
          {selectedFace && (
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={selectedFace.image}
                alt={selectedFace.username}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {selectedFace.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Grid>
    </Grid>
  </PageTemplate>
  )
};

export default Faces;