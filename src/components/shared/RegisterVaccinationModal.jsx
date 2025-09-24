// src/components/shared/RegisterVaccinationModal.jsx

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button, MenuItem, Typography, IconButton, Box } from '@mui/material';
import { Vaccines, Close, Save } from '@mui/icons-material';

export default function RegisterVaccinationModal({
  isOpen,
  onClose,
  onSubmit,
  patientName,
  availableVaccines
}) {
  const today = new Date().toISOString().split('T')[0]; // Formato AAAA-MM-DD

  const initialFormData = {
    vaccineId: availableVaccines && availableVaccines.length > 0 ? availableVaccines[0].id : '',
    dose: '', // Ex: 1ª Dose, 2ª Dose, Reforço, Dose Única
    dateApplied: today,
    batch: '',
    professional: '', // Nome do profissional
    unit: '' // Unidade/Local de aplicação
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Resetar formulário quando o modal é reaberto ou fechado
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setFormErrors({});
    }
  }, [isOpen, availableVaccines]); // Adicionado availableVaccines como dependência

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.vaccineId) errors.vaccineId = "Selecione uma vacina.";
    if (!formData.dose.trim()) errors.dose = "A dose é obrigatória.";
    if (!formData.dateApplied) errors.dateApplied = "A data de aplicação é obrigatória.";
    if (!formData.batch.trim()) errors.batch = "O lote é obrigatório.";
    if (!formData.professional.trim()) errors.professional = "O profissional é obrigatório.";
    if (!formData.unit.trim()) errors.unit = "A unidade de aplicação é obrigatória.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Encontrar o nome da vacina para passar junto
      const selectedVaccine = availableVaccines.find(v => v.id === formData.vaccineId);
      onSubmit({ ...formData, vaccineName: selectedVaccine?.name || 'Vacina Desconhecida' });
      onClose(); // Fecha o modal após submissão bem-sucedida
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 900 }}>
        <Vaccines color="success" sx={{ fontSize: 28 }} />
        Registrar Vacinação para <Box component="span" sx={{ fontWeight: 700, ml: 1 }}>{patientName}</Box>
        <IconButton onClick={onClose} sx={{ marginLeft: 'auto' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Vacina *"
                name="vaccineId"
                value={formData.vaccineId}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.vaccineId}
                helperText={formErrors.vaccineId}
              >
                <MenuItem value="" disabled>Selecione uma vacina</MenuItem>
                {availableVaccines.map(vaccine => (
                  <MenuItem key={vaccine.id} value={vaccine.id}>{vaccine.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dose *"
                name="dose"
                value={formData.dose}
                onChange={handleChange}
                placeholder="Ex: 1ª Dose, Reforço"
                fullWidth
                error={!!formErrors.dose}
                helperText={formErrors.dose}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Lote *"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.batch}
                helperText={formErrors.batch}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Data da Aplicação *"
                name="dateApplied"
                type="date"
                value={formData.dateApplied}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: today }}
                error={!!formErrors.dateApplied}
                helperText={formErrors.dateApplied}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Profissional Responsável *"
                name="professional"
                value={formData.professional}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.professional}
                helperText={formErrors.professional}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unidade/Local de Aplicação *"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                fullWidth
                error={!!formErrors.unit}
                helperText={formErrors.unit}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="outlined">Cancelar</Button>
          <Button type="submit" variant="contained" color="success" startIcon={<Save />}>Registrar Vacinação</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}