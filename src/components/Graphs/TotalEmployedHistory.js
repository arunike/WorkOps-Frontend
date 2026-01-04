import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, Box, Typography } from "@mui/material";
import { BaseOptionChart } from "../../components/charts/";
import { useState, useEffect } from "react";

const TotalEmployedHistory = () => {
  const [EmployedHistory, setEmployedHistory] = useState();

  useEffect(() => {
    const getTotal = async () => {
      fetchDetails();
    };
    getTotal();
  }, []);

  const fetchDetails = async () => {
  };

  const GetPercentageChange = () => {
    const Min = Math.min(...EmployedHistory.map((o) => o.y));
    const Max = Math.max(...EmployedHistory.map((o) => o.y));
    const percentage = Math.round(Math.abs((Min - Max) / Min) * 100);
    return percentage;
  };
  return (
    <div>
      {EmployedHistory && EmployedHistory.length > 0 ? (
        <Card>
          <CardHeader
            title="Employed over time"
            subheader={`(+${GetPercentageChange().toString()}%) than last year`}
          />
          <Box sx={{ p: 2, pb: 1 }} dir="ltr">
            <ReactApexChart
              type="area"
              series={[
                {
                  name: "Employed",
                  type: "area",
                  noData: {
                    text: "Loading...",
                  },
                  data: EmployedHistory.sort(function (a, b) {
                    return a.x - b.x;
                  }),
                },
              ]}
              options={merge(BaseOptionChart(), {
                stroke: { curve: "smooth" },
                xaxis: {
                  type: "datetime",
                  datetimeFormatter: {
                    year: "yyyy",
                    month: "MMM 'yy",
                  },
                },
                tooltip: {
                  shared: true,
                  intersect: false,
                  y: {
                    formatter: (y) => {
                      if (typeof y !== "undefined") {
                        return `${y.toFixed(0)} persons`;
                      }
                      return y;
                    },
                  },
                },
              })}
              height={150}
            />
          </Box>
        </Card>
      ) : (
        <Card>
          <CardHeader title="Employed over time" />
          <Box sx={{ p: 3, textAlign: "center", pb: 5 }}>
            <Typography variant="body2" color="text.secondary">
              No data available
            </Typography>
          </Box>
        </Card>
      )}
    </div>
  );
};
export default TotalEmployedHistory;
