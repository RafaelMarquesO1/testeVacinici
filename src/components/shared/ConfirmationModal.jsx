import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box } from '@mui/material';
import { WarningAmber, Close } from '@mui/icons-material';
// Importaremos o CSS do Dashboard que conterá os estilos do modal
// import '../../styles/Dashboard.css'; // Ajuste o caminho se a estrutura for diferente

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Ação",
  message = "Você tem certeza que deseja prosseguir com esta ação?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  icon,
  isDestructive = false
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 900 }}>
        {icon ? icon : (isDestructive && <WarningAmber color="error" sx={{ fontSize: 28 }} />)}
        <Typography component="span" sx={{ fontWeight: 700 }}>{title}</Typography>
        <IconButton onClick={onClose} sx={{ marginLeft: 'auto' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">{cancelText}</Button>
        <Button onClick={onConfirm} variant="contained" color={isDestructive ? 'error' : 'primary'}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
}