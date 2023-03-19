import {
  CardActionArea,
  CardContent,
  Card as MCard,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import Axios from "../../utils/Axios";

const Card = ({ product }) => {
  const [qt, setQt] = useState(0);

  useEffect(() => {
    Axios.get(`/stock/products/${product.id}`)
      .then(({ data }) => {
        setQt(data.stock_amount);
      })
      .catch((error) => console.log(error));
  }, [qt, product.id]);

  const handleAction = () => {
    Axios.post(`/stock/products/${product.id}/consume`, {
      amount: 1,
      transaction_type: "consume",
      spoiled: false,
    })
      .then(() => {
        setQt(qt - 1);
      })
      .catch((error) => console.log(error));
  };

  return (
    <MCard sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={handleAction}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {`${product.name} (${qt})`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </MCard>
  );
};

export default Card;
