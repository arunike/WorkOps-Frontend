import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import { Box, Typography, Container } from "@mui/material";
import { MotionContainer, varBounceIn } from "../../components/animate";
import Page from "../../components/Page";
import { Icon } from "@iconify/react";

const RootStyle = styled(Page)(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
}));

export default function Page403() {
  return (
    <RootStyle title="Access Forbidden">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 500, margin: "auto", textAlign: "center" }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h1" paragraph>
                Access forbidden!
              </Typography>
            </motion.div>
            <Typography sx={{ color: "text.secondary" }}>
              I'm sorry buddy...
            </Typography>
            <motion.div variants={varBounceIn}>
              <Box sx={{ pt: 8 }}>
                <Icon icon="bx:bxs-lock" color="#315B98" fontSize="12em" />
              </Box>
            </motion.div>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
