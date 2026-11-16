import { useRef, useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CloseIcon from "@mui/icons-material/Close";
import countTextLines from "@/utilities/countTextLines";


interface SectionProps {
  title: string;
  content: string;
  emptyMessage: string;
}

const SectionCancelationModal: React.FC<SectionProps> = ({ title, content, emptyMessage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && content) {
      const lines = countTextLines(
        content,
        containerRef.current.offsetWidth,
        getComputedStyle(containerRef.current).font
      );
      setShowButton(lines > 1);
    }
  }, [content]);

  return (
    <Grid size={{xs:12, md: 4}}>
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      {content ? (
        <Box mt={1} ref={containerRef}>
          <Typography variant="body2" noWrap>
            {content}
          </Typography>
        </Box>
      ) : (
        <Typography color="text.secondary" mt={1}>
          {emptyMessage}
        </Typography>
      )}
      {showButton && (
        <Box mt={2}>
            <Button
                sx={{ textTransform: 'none' }}
                variant="outlined"
                onClick={() => setIsModalOpen(true)}
            >
                Mostrar más
            </Button>
        </Box>
      )}

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {title}
          <IconButton
            aria-label="close"
            onClick={() => setIsModalOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">{content}</Typography>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default SectionCancelationModal
