import React, { useEffect, useState } from "react";

import Card from "./Card";
import { Grid } from "@mui/material";
import instance from "../../utils/Axios";

const Inventory = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    instance
      .get("/objects/products")
      .then(({ data }) => {
        setProducts(data.filter(({ userfields }) => !!userfields.inventory));
      })
      .catch((error) => console.log(error));
  }, []);

  const table = products
    .sort((obj1, obj2) => ("" + obj1.name).localeCompare(obj2.name))
    .map((product) => (
      <Grid key={product.id} item>
        <Card key={product.id} product={product} />
      </Grid>
    ));

  return (
    <Grid container spacing={2} style={{ margin: "0.5rem" }}>
      {table}
    </Grid>
  );
};

export default Inventory;
