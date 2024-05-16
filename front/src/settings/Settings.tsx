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
  name: string;
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
    name: '',
    portal: 0
}

function Settings() {
  const [defaultSettings, setDefaultSettings] = useState<ISettings>(placeholderSettings);
  const [settings, setSettings] = useState<ISettings>(placeholderSettings)
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    axios.get<ISettings>('http://127.0.0.1:8000/api/portal/settings/my_settings').then(response => {
        setSettings(response.data);
        setDefaultSettings(response.data);

        emailInputRef.current!.value = response.data.email ? response.data.email : ''
        nameInputRef.current!.value = response.data.name ? response.data.name : '';
    });
  }, []);

  const handleCancel = () => {
    console.log(settings, defaultSettings);
    setSettings({ ...defaultSettings });
    if (emailInputRef.current) {
      emailInputRef.current.value = defaultSettings.email ? defaultSettings.email : ''
    }
    if (nameInputRef.current) {
      nameInputRef.current.value = defaultSettings.name ? defaultSettings.name : '';
    }
  };

  const handleSave = () => {
    axios.patch(`http://127.0.0.1:8000/api/portal/settings/${settings.id}/`, settings).then(response => {
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
    if (nameInputRef.current) {
      setSettings({ ...settings, name: nameInputRef.current.value });
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
                    <InputLabel>Эмоции</InputLabel>
                    <Tooltip title="Распознавать эмоции">
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
                    <InputLabel>Неизвестные лица</InputLabel>
                    <Tooltip title="Распознавать неизвестные лица">
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
                    <InputLabel>Доступ к API</InputLabel>
                    <Tooltip title="Открыть/закрыть доступ к API">
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
                      <InputLabel>Хранить распознавания</InputLabel>
                      <Tooltip title="Сколько распознавания хранятся в базе">
                        <IconButton>
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <Select value={settings.time_to_store} onChange={(e) => setTimeToStore(e.target.value)}>
                        <MenuItem value={1}>1 День</MenuItem>
                        <MenuItem value={7}>1 Неделя</MenuItem>
                        <MenuItem value={14}>2 Недели</MenuItem>
                        <MenuItem value={30}>1 Месяц</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container direction="column" spacing={0}>
                  <Grid item>
                    <Box display="flex" alignItems="center">
                      <InputLabel>Название портала</InputLabel>
                      <Tooltip title="Название отображаемое в шапке сайта">
                        <IconButton>
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  <Grid item>
                    <TextField fullWidth inputRef={nameInputRef} onChange={setSubUrl}/>
                  </Grid>
                </Grid>

                <Grid container direction="column" spacing={0}>
                  <Grid item>
                    <Box display="flex" alignItems="center">
                      <InputLabel>Email</InputLabel>
                      <Tooltip title="Почта для уведомлений">
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
                    Отмена
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Сохранить
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