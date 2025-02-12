import { X } from "lucide-react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classes from "./Modal.module.css";

interface ModalProps extends PropsWithChildren {
  open: boolean;
  title?: string;

  onRequestClose: () => void;
  onAfterOpen?: () => void;
}

const Modal = ({
  open = false,
  title = "Modal",
  children,
  onRequestClose,
  onAfterOpen,
}: ModalProps) => {
  const [visible, setVisible] = useState(open);
  const prevOpenRef = useRef(open);

  useEffect(() => {
    if (open && prevOpenRef.current !== open) {
      if (onAfterOpen) {
        onAfterOpen();
      }
    }
    prevOpenRef.current = open;

    if (open) {
      setVisible(open);
    }
  }, [open, onAfterOpen]);

  const handleRequestClose = () => {
    onRequestClose();
  };

  const handleAnimationEnd = () => {
    if (!open) {
      setVisible(open);
    }
  };

  if (visible) {
    return createPortal(
      <div
        className={`${classes.modalRoot} ${open ? classes.fadeIn : classes.fadeOut}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className={classes.backdrop} onClick={handleRequestClose}></div>
        <div className={classes.modalContainer}>
          <div className={classes.modalHeader}>
            <h2 style={{ fontWeight: 500 }}>{title}</h2>
            <button
              className={classes.modalCloseBtn}
              onClick={handleRequestClose}
            >
              <X />
            </button>
          </div>
          <div className={classes.modalContent}>{children}</div>
        </div>
      </div>,
      document.body,
    );
  }

  return null;
};

export default Modal;
