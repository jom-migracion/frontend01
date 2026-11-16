import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';

import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export interface GalleryImage {
  src: string;
  width?: number;
  height?: number;
}

interface Props {
  open: boolean;
  images: GalleryImage[];
  index: number;
  onClose: () => void;
}

const ModalPhotoGallery: React.FC<Props> = ({ open, images, index, onClose }) => {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={images}
      plugins={[Zoom, Thumbnails, Fullscreen]}
      carousel={{
        imageFit: 'contain',
      }}
      thumbnails={{
        position: 'bottom',
        width: 96,
        height: 64,
        borderRadius: 8,
        gap: 8,
      }}
      styles={{
        container: {
          backgroundColor: 'rgba(0,0,0,0.95)',
        },
      }}
    />
  );
};

export default ModalPhotoGallery;
