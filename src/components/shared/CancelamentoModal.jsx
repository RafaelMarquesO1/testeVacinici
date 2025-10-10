import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  FormControl, FormControlLabel, Radio, RadioGroup, TextField,
  Typography, Box, Divider
} from '@mui/material';
import { Cancel, Warning } from '@mui/icons-material';

const motivosPredefinidos = [
  'Não posso comparecer no horário agendado',
  'Problemas de saúde no momento',
  'Viagem ou compromisso inadiável',
  'Já tomei esta vacina em outro local',
  'Médico recomendou adiar a vacinação',
  'Problemas de transporte',
  'Mudança de endereço',
  'Outro motivo (especificar abaixo)'
];

export default function CancelamentoModal({ 
  open, 
  onClose, 
  onConfirm, 
  agendamento 
}) {
  const [motivoSelecionado, setMotivoSelecionado] = useState('');
  const [motivoPersonalizado, setMotivoPersonalizado] = useState('');

  const handleConfirmar = () => {
    let motivoFinal = motivoSelecionado;
    
    if (motivoSelecionado === 'Outro motivo (especificar abaixo)') {
      if (!motivoPersonalizado.trim()) {
        alert('Por favor, especifique o motivo do cancelamento.');
        return;
      }
      motivoFinal = motivoPersonalizado.trim();
    } else if (!motivoSelecionado) {
      alert('Por favor, selecione um motivo para o cancelamento.');
      return;
    }
    
    onConfirm(motivoFinal);
    handleClose();
  };

  const handleClose = () => {
    setMotivoSelecionado('');
    setMotivoPersonalizado('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #fecaca',
          boxShadow: '0 8px 32px rgba(220, 38, 38, 0.15)'
        }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 700, 
        color: '#dc2626',
        borderBottom: '1px solid #fecaca',
        pb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Warning sx={{ color: '#dc2626' }} />
        Cancelar Agendamento
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {agendamento && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#fef2f2', borderRadius: 2, border: '1px solid #fecaca' }}>
            <Typography variant="body2" sx={{ color: '#7f1d1d', mb: 1 }}>
              <strong>Agendamento:</strong> {agendamento.nomeVacina}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f1d1d', mb: 1 }}>
              <strong>Data:</strong> {new Date(agendamento.dataAgendamento).toLocaleString('pt-BR')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f1d1d' }}>
              <strong>Local:</strong> {agendamento.nomeLocal}
            </Typography>
          </Box>
        )}
        
        <Typography variant="h6" sx={{ mb: 2, color: '#374151', fontWeight: 600 }}>
          Por que você deseja cancelar este agendamento?
        </Typography>
        
        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={motivoSelecionado}
            onChange={(e) => setMotivoSelecionado(e.target.value)}
          >
            {motivosPredefinidos.map((motivo, index) => (
              <FormControlLabel
                key={index}
                value={motivo}
                control={<Radio sx={{ color: '#dc2626', '&.Mui-checked': { color: '#dc2626' } }} />}
                label={motivo}
                sx={{ 
                  mb: 1,
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.95rem',
                    color: '#374151'
                  }
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
        
        {motivoSelecionado === 'Outro motivo (especificar abaixo)' && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Especifique o motivo"
              placeholder="Descreva o motivo do cancelamento..."
              value={motivoPersonalizado}
              onChange={(e) => setMotivoPersonalizado(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#dc2626' },
                  '&.Mui-focused fieldset': { borderColor: '#dc2626' }
                }
              }}
            />
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 3, 
        borderTop: '1px solid #fecaca',
        gap: 2,
        justifyContent: 'center'
      }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: '#6b7280',
            fontWeight: 600,
            px: 4
          }}
        >
          Voltar
        </Button>
        <Button 
          onClick={handleConfirmar}
          variant="contained"
          startIcon={<Cancel />}
          sx={{
            backgroundColor: '#dc2626',
            fontWeight: 600,
            px: 4,
            '&:hover': { 
              backgroundColor: '#b91c1c'
            }
          }}
        >
          Confirmar Cancelamento
        </Button>
      </DialogActions>
    </Dialog>
  );
}