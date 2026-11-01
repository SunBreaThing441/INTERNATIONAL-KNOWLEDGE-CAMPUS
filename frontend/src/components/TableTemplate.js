import React, { useState } from "react";
import { StyledTableCell, StyledTableRow } from "./styles";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  Box,
} from "@mui/material";
import { TableSkeleton } from "./LuminaSkeleton";

// Lumina Glass TableTemplate component
const TableTemplate = ({ buttonHaver: ButtonHaver, columns, rows, loading = false }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  if (loading) {
    return <TableSkeleton rows={rowsPerPage} columns={columns.length + (ButtonHaver ? 1 : 0)} />;
  }

  return (
    <Box
      sx={{
        background: "rgba(11, 19, 43, 0.7)",
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      }}
    >
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="lumina table">
          <TableHead>
            <StyledTableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
              {ButtonHaver && <StyledTableCell align="center">Actions</StyledTableCell>}
            </StyledTableRow>
          </TableHead>

          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <StyledTableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </StyledTableCell>
                    );
                  })}
                  {ButtonHaver && (
                    <StyledTableCell align="center">
                      <ButtonHaver row={row} />
                    </StyledTableCell>
                  )}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        sx={{
          color: "#94A3B8",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontSize: "0.85rem",
          },
          "& .MuiSvgIcon-root": {
            color: "#00A3FF",
          },
        }}
      />
    </Box>
  );
};

export default TableTemplate;
