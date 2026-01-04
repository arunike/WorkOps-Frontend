import { Icon } from "@iconify/react";
import dollarOutlined from "@iconify/icons-ant-design/dollar-outlined";
import { styled } from "@mui/material/styles";
import { Card, Typography } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { associatesContext } from "../../utils/context/contexts.js";
import _ from "lodash";

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(2, 0),
  color: "#095b80",
  backgroundColor: "#8cd7f7",
}));

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: "center",
  marginBottom: theme.spacing(1),
  color: "#000000",
  backgroundColor: theme.palette.grey[200],
}));

export default function AverageSalary() {
  const [loading, setLoading] = useState(true);
  const { associates } = useContext(associatesContext);
  const [chartData, setChartData] = useState();

  useEffect(() => {
    const salaries = [];
    const filtered = associates.filter(
      (associate) => associate.EmplStatus === "Employed"
    );
    filtered.forEach((associate) => {
      salaries.push(parseInt(associate.Salary));
    });
    setChartData(_.sum(salaries) / salaries.length);
    setLoading(false);
  }, [associates]);
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
  });
  return (
    <>
      <RootStyle>
        {loading && <CircularProgress />}
        {chartData !== undefined && !isNaN(chartData) ? (
          <div>
            <IconWrapperStyle>
              <Icon icon={dollarOutlined} width={35} height={35} />
            </IconWrapperStyle>
            <Typography variant="h3">
              {formatter.format(chartData)}
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              Average Salary
            </Typography>
          </div>
        ) : (
          <div>
            <IconWrapperStyle>
              <Icon icon={dollarOutlined} width={35} height={35} />
            </IconWrapperStyle>
            <Typography variant="h3">
              -
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
              Average Salary
            </Typography>
          </div>
        )}
      </RootStyle>
    </>
  );
}
