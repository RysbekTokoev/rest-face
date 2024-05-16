import * as React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Chart';
import Totals from './Totals';
import RecognitionsTable from './RecognitionsTable';
import PageTemplate from "../common/PageTemplate";
import CircleEmotions from "./CircleEmotions";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Trends from "./Trends";

function Dashboard() {
  const [date, setDate] = React.useState(new Date(Date.now() + 6 * 60 * 60 * 1000));
  const [dateRange, setDateRange] = React.useState('today');

  const handleDateRangeChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setDateRange(value);
    switch (value) {
      case 'today':
        setDate(new Date(Date.now() + 6 * 60 * 60 * 1000));
        break;
      case 'yesterday':
        setDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000));
        break;
      case 'week':
        setDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
        break;
      case 'month':
        setDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        break;
      case 'year':
        setDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
        break;
      default:
        setDate(new Date());
    }
  };

  return (
    <PageTemplate>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Select
          value={dateRange}
          onChange={handleDateRangeChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          variant={"standard"}
          sx={{mb: 1}}
        >
          <MenuItem value={'today'}>За сегодня</MenuItem>
          <MenuItem value={'week'}>За неделю</MenuItem>
          <MenuItem value={'month'}>За месяц</MenuItem>
          <MenuItem value={'year'}>За год</MenuItem>
        </Select>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Chart date={date}/>
            </Paper>
          </Grid>
          {/* Recent Totals */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Totals date={date}/>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <CircleEmotions date={date}/>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Trends />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <RecognitionsTable date={date}/>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </PageTemplate>
  );
}

export default Dashboard;