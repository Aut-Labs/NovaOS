import {
  GridColumns,
  GridEditRowApi,
  GridRenderEditCellParams,
  GridStateApi,
  useGridApiRef,
  useGridApiContext
} from "@mui/x-data-grid";
import { useMemo } from "react";
import { styled } from "@mui/material/styles";
import { InputBase } from "@mui/material";

const GridEditInputCellRoot = styled(InputBase, {
  name: "MuiDataGrid",
  slot: "EditInputCell",
  overridesResolver: (props, styles) => styles.editInputCell
})(({ theme }) => ({
  ...theme.typography.body2,
  padding: "1px 0",
  "& input": {
    padding: "0 16px",
    color: "white !important",
    height: "100%",
    "&::placeholder": {
      opacity: 1,
      color: "#707070"
    },
    "&::-webkit-input-placeholder": {
      color: "#707070",
      opacity: 1
    },
    "&::-moz-placeholder": {
      color: "#707070",
      opacity: 1
    }
  }
}));

export function CustomEditComponent(
  props: GridRenderEditCellParams,
  placeholder: string
) {
  const { id, value, field, ...other } = props;
  const apiRef = useGridApiContext();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value; // The new value entered by the user
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <GridEditInputCellRoot
      fullWidth
      type="text"
      value={value ?? ""}
      onChange={handleChange}
      placeholder={placeholder}
      {...other}
    />
  );
}

export const useDatatableApiRef = (
  tableColumns: (apiRef: any) => GridColumns
) => {
  const apiRef = useGridApiRef<GridEditRowApi & GridStateApi<any>>();
  const _columns = useMemo(() => {
    return tableColumns(() => apiRef);
  }, [apiRef, tableColumns]);

  return { apiRef, columns: _columns };
};
