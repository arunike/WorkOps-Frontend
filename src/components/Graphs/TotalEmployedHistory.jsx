import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from "@mui/material";
import { BaseOptionChart } from "../../components/charts/";
import { useState, useEffect } from "react";
import { getApiDomain } from '../../utils/getApiDomain';
import { useAuth } from '../../utils/context/AuthContext';
import React from 'react';

const TotalEmployedHistory = () => {
  const { currentUser, isAdmin } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [totalOvertime, setTotalOvertime] = useState(0);
  const [topContributors, setTopContributors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${getApiDomain()}/time-entry`;
        if (!isAdmin && currentUser) {
          url += `?associate_id=${currentUser.id}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();

          // Process data for chart
          // Aggregate overtime per day
          const dailyOvertime = {};
          data.forEach(entry => {
            const dateStr = new Date(entry.date).toISOString().split('T')[0];

            if (!dailyOvertime[dateStr]) {
              dailyOvertime[dateStr] = 0;
            }
            dailyOvertime[dateStr] += entry.overtime_hours;
          });


          // Convert to array format for ApexCharts
          let seriesData = Object.keys(dailyOvertime).map(dateStr => ({
            x: new Date(dateStr).getTime(), // Convert date string to timestamp at midnight
            y: dailyOvertime[dateStr]
          })).sort((a, b) => a.x - b.x);

          // Only show last 7 days
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 6); // 6 days ago + today = 7 days

          const filledData = [];
          for (let d = new Date(sevenDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const timestamp = new Date(dateStr).getTime();

            // Check if we have data for this day
            const existingPoint = seriesData.find(p => {
              const pDateStr = new Date(p.x).toISOString().split('T')[0];
              return pDateStr === dateStr;
            });

            if (existingPoint) {
              filledData.push(existingPoint);
            } else {
              filledData.push({ x: timestamp, y: 0 });
            }
          }

          setChartData(filledData);

          // Calculate total overtime
          const total = seriesData.reduce((acc, curr) => acc + curr.y, 0);
          setTotalOvertime(total);

          // Calculate top contributors
          const contributors = {};
          data.forEach(entry => {
            if (entry.overtime_hours > 0 && entry.first_name) {
              const name = `${entry.first_name} ${entry.last_name}`;
              if (!contributors[name]) {
                contributors[name] = 0;
              }
              contributors[name] += entry.overtime_hours;
            }
          });

          const sortedContributors = Object.keys(contributors)
            .map(name => ({ name, hours: contributors[name] }))
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 5); // Top 5

          setTopContributors(sortedContributors);
        }
      } catch (error) {
        console.error("Error fetching time entries:", error);
      }
    };
    fetchData();
  }, [currentUser, isAdmin]);

  const chartOptions = merge(BaseOptionChart(), {
    colors: ['#FF9800'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 4, colors: ['#FF9800'], strokeColors: '#fff', strokeWidth: 2 },
    xaxis: {
      type: "datetime",
      labels: {
        format: 'MM/dd',
        datetimeUTC: false,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        format: 'MM/dd/yyyy',
      },
      y: {
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return `${y.toFixed(1)} hours`;
          }
          return y;
        },
      },
    },
  });

  return (
    <div>
      <Card>
        <CardHeader
          title={isAdmin ? "Total Overtime (All Employees)" : "Your Overtime History"}
          subheader={`Total: ${totalOvertime.toFixed(1)} hours`}
        />
        <Box sx={{ p: 2, pb: 1 }} dir="ltr">
          {chartData && chartData.length > 0 ? (
            <ReactApexChart
              type="area"
              series={[
                {
                  name: "Overtime Hours",
                  data: chartData,
                },
              ]}
              options={chartOptions}
              height={300}
            />
          ) : (
            <Box sx={{ p: 3, textAlign: "center", pb: 5 }}>
              <Typography variant="body2" color="text.secondary">
                No overtime data available
              </Typography>
            </Box>
          )}
        </Box>
      </Card>

      {isAdmin && topContributors.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardHeader title="Top Overtime Contributors" />
          <Box sx={{ p: 2 }}>
            <List>
              {topContributors.map((person, index) => (
                <React.Fragment key={person.name}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{person.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={person.name}
                      secondary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {person.hours.toFixed(1)} hours overtime
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < topContributors.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Card>
      )}
    </div>
  );
};
export default TotalEmployedHistory;
