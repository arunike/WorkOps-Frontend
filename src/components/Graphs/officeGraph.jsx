import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
import { useTheme, styled } from "@mui/material/styles";
import { Card, CardHeader, Stack, Typography } from "@mui/material";
import { fNumber } from "../../utils/formatNumber";
import BaseOptionChart from "../charts/BaseOptionChart";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect, useContext } from "react";
import {
  officesContext,
  associatesContext,
} from "../../utils/context/contexts";

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled("div")(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: 4,
  position: "relative",
  "& .apexcharts-canvas": {
    stroke: "none",
    overflow: "visible",
  },
  "& .apexcharts-legend": {
    height: LEGEND_HEIGHT,
    alignContent: "center",
    position: "absolute !important",
    borderTop: `solid 1px ${theme.palette.divider}`,
    bottom: 0,
    width: "100%",
    display: "flex !important",
    justifyContent: "flex-start",
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    alignItems: "flex-end",
    marginBottom: theme.spacing(-4),
  },
}));

export default function OfficeGraph() {
  const { allOffices } = useContext(officesContext);
  const OFFICES = allOffices.map((office) => office.name || office);
  const { associates } = useContext(associatesContext);
  const theme = useTheme();
  const [loadingOffice, setLoadingOffice] = useState(true);
  const [officesData, setOfficesData] = useState();

  useEffect(() => {
    const getOffice = async () => {
      setLoadingOffice(true);
      const officeData = [];
      for (const off of OFFICES) {
        officeData.push(fetchDetails(off));
      }
      setOfficesData(officeData);
      setLoadingOffice(false);
    };
    getOffice();
  }, [allOffices, associates]);

  const fetchDetails = (off) => {
    const filtered = associates.filter(
      (associate) =>
        associate.Office === off && associate.EmplStatus === "Employed"
    );
    return filtered.length;
  };
  const chartOptions = merge(BaseOptionChart(), {
    labels: OFFICES,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: false, horizontalAlign: "center", position: "bottom" },
    dataLabels: { enabled: true, dropShadow: { enabled: true } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName) + " associates",
        title: {
          formatter: (seriesName) => `${seriesName} -`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });
  console.log(officesData);
  return (
    <Card>
      <Typography component="div">
        <CardHeader title="Associates per Office" sx={{ fontWeight: "bold" }} />
      </Typography>
      {loadingOffice && (
        <Stack
          alignItems="center"
          justifyContent="center"
          mb={5}
        >
          <CircularProgress />
        </Stack>
      )}
      {officesData && officesData.length > 0 ? (
        <ChartWrapperStyle dir="ltr">
          <ReactApexChart
            type="pie"
            series={officesData}
            options={chartOptions}
            height={CHART_HEIGHT}
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
