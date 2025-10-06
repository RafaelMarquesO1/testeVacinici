import React, { useState, useEffect, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box, Typography, Grid, Card, CardContent, CardActions, Button, 
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Alert, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tooltip, CircularProgress, Fade, Stack
} from '@mui/material';
import {
  Event, Person, Vaccines, LocationOn, CheckCircle, Cancel, 
  Edit, Delete, Add, Refresh, FilterList, Search
} from '@mui/icons-material';
import { api } from '../services/api';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import { AuthContext } from '../contexts/AuthContext';

const statusColors = {
  'Agendado': 'primary',
  'Confirmado': 'success',
  'Realizado': 'info',
  'Cancelado': 'error',
  'Faltou': 'warning'
};

const statusOptions = [
  { value: 'Agendado', label: 'Agendado' },
  { value: 'Confirmado', label: 'Confirmado' },
  { value: 'Realizado', label: 'Realizado' },
  { value: 'Cancelado', label: 'Cancelado' },
  { value: 'Faltou', label: 'Faltou' }
];

export default function AgendamentosPage() {
  const theme = useTheme();
  const { currentUser } = useContext(AuthContext);
  const [confirmApplyOpen, setConfirmApplyOpen] = useState(false);
  const [agendamentoParaAplicar, setAgendamentoParaAplicar] = useState(null);
  const handleRegisterVaccination = (agendamento) => {
    setAgendamentoParaAplicar(agendamento);
    setConfirmApplyOpen(true);
  };

  const handleConfirmApply = async () => {
    if (!agendamentoParaAplicar) return;
    try {
      // Montar objeto apenas com campos preenchidos
      const registro = {
        pacienteId: agendamentoParaAplicar.pacienteId,
        funcionarioId: currentUser.id,
        vacinaId: agendamentoParaAplicar.vacinaId,
        dose: agendamentoParaAplicar.dose && agendamentoParaAplicar.dose.trim() !== '' ? agendamentoParaAplicar.dose : 'N/A',
        dataAplicacao: new Date().toISOString().split('T')[0],
        lote: 'Automático',
        localId: agendamentoParaAplicar.localId
      };
      if (agendamentoParaAplicar.validade) registro.validade = agendamentoParaAplicar.validade;
      if (agendamentoParaAplicar.comprovanteUrl) registro.comprovanteUrl = agendamentoParaAplicar.comprovanteUrl;
      if (agendamentoParaAplicar.observacoes) registro.observacoes = agendamentoParaAplicar.observacoes;
      console.log('Dados enviados para registro de vacinação:', registro);
      await api.createHistorico(registro);
      // Remover agendamento
      await api.deleteAgendamento(agendamentoParaAplicar.id);
      showSnackbar('Vacina aplicada e agendamento removido!', 'success');
      setConfirmApplyOpen(false);
      setAgendamentoParaAplicar(null);
      await loadAgendamentos();
    } catch (e) {
      showSnackbar('Erro ao aplicar vacina!', 'error');
    }
  };
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAgendamentos, setFilteredAgendamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadAgendamentos();
  }, []);

  useEffect(() => {
    filterAgendamentos();
  }, [agendamentos, searchTerm, statusFilter]);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      const data = await api.getAgendamentos();
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      showSnackbar('Erro ao carregar agendamentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterAgendamentos = () => {
    let filtered = agendamentos;

    if (searchTerm) {
      filtered = filtered.filter(agendamento => 
        agendamento.nomePaciente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agendamento.nomeVacina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agendamento.nomeLocal?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(agendamento => agendamento.status === statusFilter);
    }

    setFilteredAgendamentos(filtered);
  };

  const handleEditStatus = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setNewStatus(agendamento.status);
    setEditDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await api.updateAgendamentoStatus(selectedAgendamento.id, newStatus);
      await loadAgendamentos();
      setEditDialogOpen(false);
      showSnackbar('Status atualizado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showSnackbar('Erro ao atualizar status', 'error');
    }
  };

  const handleCancelAgendamento = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setPendingAction(() => () => cancelAgendamento(agendamento.id));
    setConfirmOpen(true);
  };

  const cancelAgendamento = async (id) => {
    try {
      await api.deleteAgendamento(id);
      await loadAgendamentos();
      showSnackbar('Agendamento cancelado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      showSnackbar('Erro ao cancelar agendamento', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('pt-BR');
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('pt-BR');
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
            Administração de Agendamentos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie agendamentos, confirme presenças e aplique vacinas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={loadAgendamentos}
          sx={{ fontWeight: 'bold' }}
        >
          Atualizar
        </Button>
      </Box>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar"
                placeholder="Paciente, vacina ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {statusOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                {filteredAgendamentos.length} agendamento(s) encontrado(s)
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de Agendamentos */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Paciente</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vacina</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Local</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Data/Hora</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAgendamentos.map((agendamento) => (
              <Fade in key={agendamento.id} timeout={300}>
                <TableRow hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person color="primary" />
                      <Typography variant="body2" fontWeight="medium">
                        {agendamento.nomePaciente || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Vaccines color="primary" />
                      <Typography variant="body2">
                        {agendamento.nomeVacina || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn color="primary" />
                      <Typography variant="body2">
                        {agendamento.nomeLocal || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {formatDate(agendamento.dataAgendamento)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(agendamento.dataAgendamento)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={agendamento.status}
                      color={statusColors[agendamento.status] || 'default'}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Editar Status">
                        <IconButton
                          size="small"
                          onClick={() => handleEditStatus(agendamento)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancelar Agendamento">
                        <IconButton
                          size="small"
                          onClick={() => handleCancelAgendamento(agendamento)}
                          color="error"
                        >
                          <Cancel />
                        </IconButton>
                      </Tooltip>
                      {currentUser?.tipoUsuario === 'Funcionario' && currentUser?.cargo?.toLowerCase().includes('enfermeir') && (
                        <Tooltip title="Aplicar Vacina">
                          <span>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<Vaccines />}
                              onClick={() => handleRegisterVaccination(agendamento)}
                              sx={{
                                bgcolor: 'success.main',
                                color: 'white',
                                fontWeight: 700,
                                borderRadius: 2,
                                px: 2,
                                boxShadow: 2,
                                textTransform: 'none',
                                '&:hover': {
                                  bgcolor: 'success.dark',
                                  color: 'white',
                                  boxShadow: 4
                                },
                                transition: 'all 0.2s',
                              }}
                            >
                              Aplicar Vacina
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
      {/* Modal de Confirmação de Aplicação */}
      <ConfirmationModal
        isOpen={confirmApplyOpen}
        onClose={() => setConfirmApplyOpen(false)}
        onConfirm={handleConfirmApply}
        title="Confirmar Aplicação"
        message={agendamentoParaAplicar ? `Tem certeza que deseja aplicar a vacina para ${agendamentoParaAplicar.nomePaciente}?` : ''}
        confirmText="Sim, aplicar"
        cancelText="Cancelar"
        isDestructive={false}
        icon={<Vaccines color="success" sx={{ fontSize: 28 }} />}
      />
                </TableRow>
              </Fade>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredAgendamentos.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum agendamento encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente ajustar os filtros de busca
          </Typography>
        </Box>
      )}

      {/* Dialog de Edição de Status */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Status do Agendamento</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Paciente: <strong>{selectedAgendamento?.nomePaciente}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Vacina: <strong>{selectedAgendamento?.nomeVacina}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
              Data: <strong>{selectedAgendamento && formatDateTime(selectedAgendamento.dataAgendamento)}</strong>
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Novo Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Novo Status"
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleUpdateStatus} variant="contained">
            Atualizar
          </Button>
        </DialogActions>
      </Dialog>


      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (pendingAction) pendingAction();
          setConfirmOpen(false);
        }}
        title="Cancelar Agendamento"
        message="Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
        confirmText="Cancelar Agendamento"
        cancelText="Manter"
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

