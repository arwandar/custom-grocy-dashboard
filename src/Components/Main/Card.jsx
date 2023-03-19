import {
  Alert,
  Badge,
  CardActionArea,
  CardContent,
  Card as MCard,
  Snackbar,
  Typography,
  badgeClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import Axios from "../../utils/Axios";

const Card = ({ product }) => {
  const [qt, setQt] = useState(0);
  const [snackbar, setSnackbar] = useState(false);
  const [severitySnackbar, setSeveritySnackbar] = useState();

  useEffect(() => {
    Axios.get(`/stock/products/${product.id}`)
      .then(({ data }) => {
        setQt(data.stock_amount);
      })
      .catch((error) => console.log(error));
  }, [product.id]);

  const handleAction = () => {
    Axios.post(`/stock/products/${product.id}/consume`, {
      amount: 1,
      transaction_type: "consume",
      spoiled: false,
    })
      .then(() => {
        setQt(qt - 1);
        setSeveritySnackbar("success");
        setSnackbar(true);
      })
      .catch((error) => {
        setSeveritySnackbar("error");
        setSnackbar(true);
      });
  };

  return (
    <Badge
      badgeContent={qt}
      color="primary"
      sx={{
        [`& .${badgeClasses.badge}`]: {
          fontSize: "2em",
        },
      }}
    >
      <MCard sx={{ maxWidth: 345 }}>
        <CardActionArea onClick={handleAction}>
          <CardContent>
            <Typography variant="h5" noWrap>
              {product.name}
            </Typography>
          </CardContent>
        </CardActionArea>
        <Snackbar
          open={snackbar}
          autoHideDuration={1000}
          onClose={() => setSnackbar(false)}
        >
          <Alert
            onClose={() => setSnackbar(false)}
            severity={severitySnackbar}
            sx={{ width: "100%" }}
          >
            Done
          </Alert>
        </Snackbar>
      </MCard>
    </Badge>
  );
};

export default Card;
