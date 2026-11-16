// components/PaginationControls.tsx
import { Box, IconButton, Pagination } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onChange,
}) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={2} p={2}>
      <IconButton onClick={() => onChange(1)} disabled={page === 1}>
        <FirstPageIcon />
      </IconButton>

      <Pagination
        page={page}
        count={totalPages}
        onChange={(_, value) => onChange(value)}
        color="primary"
      />

      <IconButton onClick={() => onChange(totalPages)} disabled={page === totalPages}>
        <LastPageIcon />
      </IconButton>
    </Box>
  );
};
