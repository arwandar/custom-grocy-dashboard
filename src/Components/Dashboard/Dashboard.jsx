import React, { useEffect, useMemo, useState } from "react";
import Axios from "../../utils/Axios";
import { MaterialReactTable } from "material-react-table";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Input,
  Snackbar,
  Typography,
} from "@mui/material";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(false);
  const [snackbar, setSnackbar] = useState();
  const [severitySnackbar, setSeveritySnackbar] = useState();

  useEffect(() => {
    if (currentProduct) return;
    let locations;
    let stock;

    Axios.get("/objects/locations?order=name:asc")
      .then(({ data }) => {
        locations = data.reduce(
          (obj, current) => ({
            ...obj,
            [current.id]: { ...current, amount: "", subRows: [] },
          }),
          {}
        );
        return Axios.get("/stock");
      })
      .then(({ data }) => {
        stock = data;
        return Axios.get("/objects/products");
      })
      .then(({ data }) => {
        const plop = Object.values(
          data.reduce((list, current) => {
            current.amount =
              stock.find(({ product_id }) => product_id === current.id)
                ?.amount_aggregated ?? 0;

            if (current.parent_product_id) {
              if (!list[current.parent_product_id])
                list[current.parent_product_id] = { subRows: [] };

              list[current.parent_product_id].subRows.push(current);
            } else {
              if (!list[current.id])
                list[current.id] = { ...current, subRows: [] };
              else list[current.id] = { ...current, ...list[current.id] };
            }
            return list;
          }, {})
        ).reduce((locs, current) => {
          locs[current.location_id].subRows.push(current);
          return locs;
        }, locations);

        setProducts(Object.values(plop));
      })
      .catch((error) => console.log(error));
  }, [currentProduct]);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Nom" },
      { accessorKey: "amount", header: "Qt", size: 25 },
    ],
    []
  );

  const handleClose = (shouldSave = false) => {
    const product = { ...currentProduct };
    setCurrentProduct(false);

    if (shouldSave)
      Axios.post(`/stock/products/${product.id}/inventory`, {
        new_amount: product.amount,
      })
        .then(() => {
          setSeveritySnackbar("success");
          setSnackbar(true);
        })
        .catch((error) => {
          setSeveritySnackbar("error");
          setSnackbar(true);
        });
  };

  const buttons = [
    { name: "-10", fct: (qt = 0) => (qt - 10 < 0 ? 0 : qt - 10) },
    { name: "-5", fct: (qt = 0) => (qt - 5 < 0 ? 0 : qt - 5) },
    { name: "-1", fct: (qt = 0) => (qt - 1 < 0 ? 0 : qt - 1) },
    { name: "0", fct: () => 0 },
    { name: "1", fct: (qt = 0) => qt + 1 },
    { name: "5", fct: (qt = 0) => qt + 5 },
    { name: "10", fct: (qt = 0) => qt + 10 },
  ];

  return (
    <>
      <Snackbar
        open={snackbar}
        autoHideDuration={1000}
        onClose={() => setSnackbar(false)}
      >
        <Alert onClose={() => setSnackbar(false)} severity={severitySnackbar}>
          {severitySnackbar === "success" ? "OK" : "KO"}
        </Alert>
      </Snackbar>
      <Dialog open={!!currentProduct} onClose={handleClose} fullScreen>
        <Typography variant="h4">{`${currentProduct?.name} (${currentProduct?.amount})`}</Typography>
        <DialogContent>
          {buttons.map(({ name, fct }) => (
            <Button
              onClick={() =>
                setCurrentProduct({
                  ...currentProduct,
                  amount: fct(currentProduct.amount),
                })
              }
            >
              {name}
            </Button>
          ))}
          <Input
            value={currentProduct?.amount}
            type="number"
            onChange={(event) =>
              setCurrentProduct({
                ...currentProduct,
                amount:
                  event.target.value === "" ? "" : Number(event.target.value),
              })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-evenly" }}>
          <Button onClick={() => handleClose()}>Annuler</Button>
          <Button onClick={() => handleClose(true)}>Valider</Button>
        </DialogActions>
      </Dialog>

      <MaterialReactTable
        columns={columns}
        data={products}
        enableExpanding
        enablePagination={false}
        enableStickyHeader
        enableGrouping
        enableRowVirtualization
        initialState={{
          density: "compact",
          expanded: false,
          sorting: [{ id: "name", desc: false }],
          columnPinning: { right: ["amount"] },
        }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: (event) => {
            console.log(row);
            !row.original.subRows || row.original.subRows.length === 0
              ? setCurrentProduct(row.original)
              : row.toggleExpanded();
          },
          sx: {
            cursor: "pointer",
          },
        })}
      />
    </>
  );
};

export default Dashboard;
