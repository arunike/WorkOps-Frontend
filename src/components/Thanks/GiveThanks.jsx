import {
  Container,
  Card,
  Grid,
  TextField,
  Box,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState, useRef, useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { associatesContext } from "../../utils/context/contexts";
import ReactCanvasConfetti from "react-canvas-confetti";
import { useAuth } from "../../utils/context/AuthContext";
import "./ThanksCardElements/cardMedia.css";
import Page from "../../components/Page";

const GiveThanks = () => {
  const { userData } = useAuth();
  const { associates } = useContext(associatesContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [giveThanksData, setGiveThanksData] = useState({
    Comment: undefined,
    To: undefined,
    From: "",
    Timestamp: new Date(),
    Category: undefined,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8081/thanks-categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch thanks categories", error);
      }
    };
    fetchCategories();
  }, []);
  const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 20,
  };

  const refAnimationInstance = useRef(null);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.95, x: 0.6 },
        particleCount: Math.floor(250 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 20,
      startVelocity: 95,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  // Generate consistent gradient based on category name
  const getCategoryGradient = (categoryName) => {
    if (!categoryName) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

    // Use category name to seed random colors for consistency
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue1 = Math.abs(hash % 360);
    const hue2 = Math.abs((hash * 2) % 360);

    return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%) 0%, hsl(${hue2}, 70%, 50%) 100%)`;
  };

  const onSubmit = async () => {
    const payload = {
      from_id: parseInt(userData.id),
      to_id: parseInt(giveThanksData.To),
      message: giveThanksData.Comment,
      category: giveThanksData.Category,
      timestamp: new Date().getTime(),
    };

    try {
      const response = await fetch("http://localhost:8081/thanks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Thanks submitted successfully");
        setGiveThanksData({
          Comment: undefined,
          To: undefined,
          From: "",
          Timestamp: new Date(),
          Category: undefined,
        });
        navigate("/thanks");
      } else {
        console.error("Failed to submit thanks");
      }
    } catch (error) {
      console.error("Error submitting thanks:", error);
    }
  };
  return (
    <Page title="WorkOps - Give Thanks">
      <Container>
        <Grid
          container
          direction="row"
          justifyContent="center"
          sx={{ paddingTop: 2 }}
        >
          <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
          <Grid item>
            <Box>
              <Card sx={{ width: { xs: 320, sm: 450, lg: 450 }, height: 500 }}>
                {giveThanksData.Category !== undefined ? (
                  <div
                    style={{
                      height: 140,
                      background: getCategoryGradient(giveThanksData.Category),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    {giveThanksData.Category}
                  </div>
                ) : (
                  <div
                    style={{
                      height: 140,
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#333',
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }}
                  >
                    Give Thanks
                  </div>
                )}
                <Grid container direction="column" padding={2} rowGap={1}>
                  <Grid item>
                    <TextField
                      name="Category"
                      value={
                        giveThanksData.Category ? giveThanksData.Category : ""
                      }
                      select
                      label="Category"
                      fullWidth
                      onChange={(event) =>
                        setGiveThanksData({
                          ...giveThanksData,
                          [event.target.name]: event.target.value,
                          ["From"]: userData.id,
                        })
                      }
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.name}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item>
                    <TextField
                      label="For..."
                      select
                      name="To"
                      value={giveThanksData.To ? giveThanksData.To : ""}
                      fullWidth
                      onChange={(event) =>
                        setGiveThanksData({
                          ...giveThanksData,
                          [event.target.name]: event.target.value,
                        })
                      }
                    >
                      {associates
                        .sort((a, b) => (a.FirstName > b.FirstName ? 1 : -1))
                        .map((associate) => (
                          <MenuItem key={associate.id} value={associate.id}>
                            {associate.FirstName} {associate.LastName}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      name="Comment"
                      label="Reason"
                      value={
                        giveThanksData.Comment ? giveThanksData.Comment : ""
                      }
                      onChange={(event) =>
                        setGiveThanksData({
                          ...giveThanksData,
                          [event.target.name]: event.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={
                        giveThanksData.Comment === undefined ||
                        giveThanksData.Comment === "" ||
                        giveThanksData.To === undefined ||
                        giveThanksData.Category === undefined
                      }
                      onClick={() => onSubmit()}
                      onMouseDown={fire}
                    >
                      Post
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default GiveThanks;
