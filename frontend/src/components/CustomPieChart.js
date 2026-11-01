import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Box, Typography } from "@mui/material";

// UNESCO Lumina Palette: Present = Emerald Green, Absent = Crimson/Slate
const COLORS = ["#00C49F", "#EF4444"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <Box
        sx={{
          background: "rgba(7, 13, 30, 0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "10px",
          p: 1.5,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700, color: data.payload.fill || "#FFFFFF" }}>
          {data.name}: {data.value} Sessions
        </Typography>
      </Box>
    );
  }
  return null;
};

const CustomPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={105}
          paddingAngle={4}
          dataKey="value"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
