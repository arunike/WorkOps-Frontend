import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
import { useTheme, styled } from "@mui/material/styles";
import { Card, CardHeader, Stack, Typography } from "@mui/material";
import { fNumber } from "../../utils/formatNumber.js";
import BaseOptionChart from "../charts/BaseOptionChart";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useContext } from "react";

import {
  departmentsContext,
  associatesContext,
} from "../../utils/context/contexts.js";

const CHART_HEIGHT = 500;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled("div")(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(1),
  "& .apexcharts-canvas svg": { height: CHART_HEIGHT },
  "& .apexcharts-canvas svg,.apexcharts-canvas foreignObject": {
    overflow: "visible",
  },
  "& .apexcharts-legend": {
    height: LEGEND_HEIGHT,
    alignContent: "center",
    position: "relative !important",
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

export default function DepartmentGraph() {
  const { allDepartments } = useContext(departmentsContext);
  const { associates } = useContext(associatesContext);

  const [chartData, setChartData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDepartment = () => {
      const CHART_DATA = [];
      const DEPARTMENTS = allDepartments.map(d => d.name || d);
      for (const dep of DEPARTMENTS) {
        CHART_DATA.push(fetchDetails(dep));
      }
      setChartData(CHART_DATA);
      setLoading(false);
    };
    getDepartment();
  }, [allDepartments]);

  const fetchDetails = (dep) => {
    const filtered = associates.filter(
      (associate) => associate.Department === dep
    );

    return filtered.length;
  };

  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    labels: allDepartments.map(d => d.name || d),
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: "center" },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });

  return (
    <Card>
      <CardHeader title="Associates per Department" />
      {loading && (
        <Stack
          alignItems="center"
          justifyContent="center"
          mb={5}
        >
          <CircularProgress />
        </Stack>
      )}
      {chartData && chartData.length > 0 ? (
        <ChartWrapperStyle dir="ltr">
          <ReactApexChart
            type="pie"
            series={chartData}
            options={chartOptions}
          />
        </ChartWrapperStyle>
      ) : (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 200 }}>
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        </Stack>
      )}
    </Card>
  );
}
