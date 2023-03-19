import {
  Button,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Card as MCard,
  Slider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import Axios from "../../utils/Axios";

const Card = ({ product }) => {
  const [qt, setQt] = useState(0);
  const [isModalOpened, setModalOpened] = useState(false);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(30);

  useEffect(() => {
    Axios.get(`/stock/products/${product.id}`)
      .then(({ data }) => {
        setQt(data.stock_amount);
      })
      .catch((error) => console.error(error));
  }, [product.id]);

  const handleClose = () => {
    setModalOpened(false);
  };

  const handleSave = () => {
    Axios.post(`/stock/products/${product.id}/inventory`, {
      new_amount: qt,
    })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((e) => console.error(e));
    handleClose();
  };

  const handleInputChange = (event) => {
    setQt(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleSliderChange = (event, newValue) => {
    setQt(newValue);
  };

  const handleBlur = () => {
    if (qt < min) {
      setQt(min);
    } else if (qt > max) {
      setQt(max);
    }
  };

  return (
    <MCard sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={() => setModalOpened(true)}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {`${product.name} (${qt})`}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Dialog open={isModalOpened} onClose={handleClose} fullScreen>
        <DialogTitle>{product.name}</DialogTitle>
        <DialogContent>
          <Slider
            value={typeof qt === "number" ? qt : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={min}
            max={max}
          />

          <Input
            value={qt}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              min,
              max,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>Valider</Button>
          <Button onClick={handleClose}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </MCard>
  );
};

export default Card;
