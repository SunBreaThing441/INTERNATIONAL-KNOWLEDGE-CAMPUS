import React from "react";
import { Box, Skeleton, Grid } from "@mui/material";
import styled from "styled-components";

/**
 * Lumina Table Skeleton Screen
 * Displays glowing placeholder rows while asynchronous API requests resolve.
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <GlassSkeletonContainer>
      {/* Table Header Skeleton */}
      <Box sx={{ display: "flex", gap: 2, p: 2.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={`th-${i}`}
            variant="text"
            sx={{
              flex: 1,
              height: 24,
              bgcolor: "rgba(255, 255, 255, 0.08)",
              borderRadius: "4px",
            }}
          />
        ))}
      </Box>

      {/* Table Rows Skeleton */}
      {Array.from({ length: rows }).map((_, rIdx) => (
        <Box
          key={`tr-${rIdx}`}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderBottom: rIdx < rows - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}
        >
          {Array.from({ length: columns }).map((_, cIdx) => (
            <Skeleton
              key={`td-${rIdx}-${cIdx}`}
              variant="rounded"
              sx={{
                flex: 1,
                height: 28,
                bgcolor: "rgba(255, 255, 255, 0.04)",
                borderRadius: "6px",
              }}
            />
          ))}
        </Box>
      ))}
    </GlassSkeletonContainer>
  );
};

/**
 * Lumina Card Grid Skeleton Screen
 * Used for Dashboards, Roster Cards, and Subject Grids
 */
export const CardGridSkeleton = ({ count = 3, xs = 12, sm = 6, md = 4 }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, idx) => (
        <Grid item xs={xs} sm={sm} md={md} key={`card-skel-${idx}`}>
          <GlassSkeletonCard>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Skeleton
                variant="circular"
                width={48}
                height={48}
                sx={{ bgcolor: "rgba(0, 163, 255, 0.15)" }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={22}
                  sx={{ bgcolor: "rgba(255, 255, 255, 0.08)" }}
                />
                <Skeleton
                  variant="text"
                  width="40%"
                  height={16}
                  sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}
                />
              </Box>
            </Box>
            <Skeleton
              variant="rounded"
              height={50}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.04)", borderRadius: "8px", mb: 1 }}
            />
            <Skeleton
              variant="text"
              width="30%"
              height={14}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}
            />
          </GlassSkeletonCard>
        </Grid>
      ))}
    </Grid>
  );
};

const GlassSkeletonContainer = styled(Box)`
  background: rgba(11, 19, 43, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const GlassSkeletonCard = styled(Box)`
  background: rgba(13, 22, 41, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
`;

export default TableSkeleton;
