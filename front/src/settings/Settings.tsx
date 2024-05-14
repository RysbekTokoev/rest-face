import React, { useState } from 'react';
import { FormControlLabel, Switch, TextField, Select, MenuItem, FormControl, InputLabel, Button, Grid, Box, Paper, Tooltip, IconButton } from '@mui/material';
import PageTemplate from "../common/PageTemplate";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import axios from "axios";

interface ISettings {
  id: number;
  detect_emotions: boolean;
  enable_api: boolean;
  detect_unknown: boolean;
  email: string;
  sub_url: string;
  time_to_store: number;
  portal: number;
}

const placeholderSettings: ISettings = {
    id: 0,
    detect_emotions: false,
    enable_api: false,
    detect_unknown: false,
    email: '',
    time_to_store: 0,
    sub_url: '',
    portal: 0
}

function Settings() {
  const [defaultSettings, setDefaultSettings] = useState<ISettings>(placeholderSettings);
  const [settings, setSettings] = useState<ISettings>(placeholderSettings)
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const subUrlInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    axios.get<ISettings>('http://127.0.0.1:8000/api/portal/settings/my_settings').then(response => {
        setSettings(response.data);
        setDefaultSettings(response.data);
    });
  }, []);

  const handleCancel = () => {
    console.log(settings, defaultSettings);
    setSettings({ ...defaultSettings });
    if (emailInputRef.current) {
      emailInputRef.current.value = defaultSettings.email ? defaultSettings.email : ''
    }
    if (subUrlInputRef.current) {
      subUrlInputRef.current.value = defaultSettings.sub_url ? defaultSettings.sub_url : '';
    }
  };

  const handleSave = () => {
    axios.patch('http://127.0.0.1:8000/api/portal/settings/my_settings', settings).then(response => {
      console.log(response);
    });
  };

  const setDetectEmotions = (value: boolean) => { setSettings({ ...settings, detect_emotions: value }) };
  const setEnableApi = (value: boolean) => { setSettings({ ...settings, enable_api: value }) };
  const setDetectUnknown = (value: boolean) => { setSettings({ ...settings, detect_unknown: value }) };
  const setEmail = () => {
    if (emailInputRef.current) {
      setSettings({ ...settings, email: emailInputRef.current.value });
    }
  };
  const setTimeToStore = (value: number | string) => {
    if (typeof value === "string") value = parseInt(value.toString());
    setSettings({ ...settings, time_to_store: value })
  };

  const setSubUrl = () => {
    if (subUrlInputRef.current) {
      setSettings({ ...settings, sub_url: subUrlInputRef.current.value });
    }
  };


  return (
    <PageTemplate>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Box mt={4} mb={4}>
            <Paper elevation={3}>
              <Box p={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <InputLabel>Detect Emotions</InputLabel>
                    <Tooltip title="Detect emotions in the faces">
                      <IconButton>
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <FormControlLabel
                    control={<Switch checked={settings.detect_emotions} onChange={() => setDetectEmotions(!settings.detect_emotions)} />}
                    label=""
                  />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <InputLabel>Detect Unknown Faces</InputLabel>
                    <Tooltip title="Detect unknown faces">
                      <IconButton>
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <FormControlLabel
                    control={<Switch checked={settings.detect_unknown} onChange={() => setDetectUnknown(!settings.detect_unknown)} />}
                    label=""
                  />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <InputLabel>Enable API</InputLabel>
                    <Tooltip title="Enable or disable API">
                      <IconButton>
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <FormControlLabel
                    control={<Switch checked={settings.enable_api} onChange={() => setEnableApi(!settings.enable_api)} />}
                    label=""
                  />
                </Box>
                {/* Add more settings here */}
                <Grid container direction="column" spacing={0}>
                  <Grid item>
                    <Box display="flex" alignItems="center">
                      <InputLabel>Time to Store</InputLabel>
                      <Tooltip title="Select the time to store data">
                        <IconButton>
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <Select value={settings.time_to_store} onChange={(e) => setTimeToStore(e.target.value)}>
                        <MenuItem value={1}>1 Day</MenuItem>
                        <MenuItem value={7}>1 Week</MenuItem>
                        <MenuItem value={14}>2 Weeks</MenuItem>
                        <MenuItem value={30}>1 Month</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container direction="column" spacing={0}>
                  <Grid item>
                    <Box display="flex" alignItems="center">
                      <InputLabel>Sub URL</InputLabel>
                      <Tooltip title="Enter the sub URL of your personal portal">
                        <IconButton>
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  <Grid item>
                    <TextField fullWidth inputRef={subUrlInputRef} onChange={setSubUrl}/>
                  </Grid>
                </Grid>

                <Grid container direction="column" spacing={0}>
                  <Grid item>
                    <Box display="flex" alignItems="center">
                      <InputLabel>Email</InputLabel>
                      <Tooltip title="Enter the email to send notifications">
                        <IconButton>
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  <Grid item>
                    <TextField fullWidth inputRef={emailInputRef} onChange={setEmail} />
                  </Grid>
                </Grid>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button color="info" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </PageTemplate>
  );
}

export default Settings;