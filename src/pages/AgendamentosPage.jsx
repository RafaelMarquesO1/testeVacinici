import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, 
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Select, MenuItem, FormControl, InputLabel, Alert, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tooltip, CircularProgress, Stack, Container
} from '@mui/material';
import {
  Event, Person, Vaccines, LocationOn, CheckCircle, Cancel, 
  Edit, Delete, Refresh, Search, Add, History, Visibility
} from '@mui/icons-material';
import { api } from '../services/api';
import ConfirmationModal from '../components/shared/ConfirmationModal';
import { AuthContext } from '../contexts/AuthContext';

const statusColors = {
  'Agendado': 'primary',
  'Confirmado': 'success',
  'Cancelado': 'error',
  'Faltou': 'warning'
};

const statusOptions = [
  { value: 'Agendado', label: 'Agendado' },
  { value: 'Confirmado', label: 'Confirmado' },
  { value: 'Cancelado', label: 'Cancelado' },
  { value: 'Faltou', label: 'Faltou' }
];

export default function AgendamentosPage() {
  const { currentUser } = useContext(AuthContext);
  const [confirmApplyOpen, setConfirmApplyOpen] = useState(false);
  const [agendamentoParaAplicar, setAgendamentoParaAplicar] = useState(null);
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
  const [newAgendamentoOpen, setNewAgendamentoOpen] = useState(false);
  const [historicoOpen, setHistoricoOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [historicoVacinas, setHistoricoVacinas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [vacinas, setVacinas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [novoAgendamento, setNovoAgendamento] = useState({
    pacienteId: '',
    vacinaId: '',
    localId: '',
    dataAgendamento: '',
    dose: ''
  });

  useEffect(() => {
    loadAgendamentos();
    loadDadosIniciais();
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

  const loadDadosIniciais = async () => {
    try {
      const [usuariosData, vacinasData, locaisData] = await Promise.all([
        api.getUsuarios(),
        api.getVacinas(),
        api.getLocaisVacinacao()
      ]);
      setUsuarios(usuariosData.filter(u => u.tipoUsuario === 'Paciente'));
      setVacinas(vacinasData);
      setLocais(locaisData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleVerHistorico = async (paciente) => {
    try {
      setSelectedPaciente(paciente);
      const historico = await api.getHistoricoVacinacao(paciente.id);
      setHistoricoVacinas(historico);
      setHistoricoOpen(true);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      showSnackbar('Erro ao carregar histórico de vacinação', 'error');
    }
  };

  const handleNovoAgendamento = () => {
    setNovoAgendamento({
      pacienteId: '',
      vacinaId: '',
      localId: '',
      dataAgendamento: '',
      dose: ''
    });
    setNewAgendamentoOpen(true);
  };

  const handleSalvarAgendamento = async () => {
    try {
      if (!novoAgendamento.pacienteId || !novoAgendamento.vacinaId || !novoAgendamento.localId || !novoAgendamento.dataAgendamento) {
        showSnackbar('Preencha todos os campos obrigatórios', 'error');
        return;
      }

      const agendamentoData = {
        ...novoAgendamento,
        funcionarioId: currentUser.id,
        status: 'Agendado'
      };

      await api.createAgendamento(agendamentoData);
      setNewAgendamentoOpen(false);
      showSnackbar('Agendamento criado com sucesso!', 'success');
      await loadAgendamentos();
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      showSnackbar('Erro ao criar agendamento', 'error');
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

  const handleRegisterVaccination = (agendamento) => {
    setAgendamentoParaAplicar(agendamento);
    setConfirmApplyOpen(true);
  };

  const handleConfirmApply = async () => {
    if (!agendamentoParaAplicar) return;
    try {
      await api.aplicarVacina(agendamentoParaAplicar.id, {
        funcionarioId: currentUser.id,
        dose: agendamentoParaAplicar.dose || '1ª dose',
        lote: 'LOTE' + Date.now(),
        observacoes: 'Vacina aplicada via sistema web'
      });
      
      showSnackbar('Vacina aplicada e registrada no histórico!', 'success');
      setConfirmApplyOpen(false);
      setAgendamentoParaAplicar(null);
      await loadAgendamentos();
    } catch (e) {
      console.error('Erro ao aplicar vacina:', e);
      showSnackbar('Erro ao aplicar vacina!', 'error');
    }
  };

  const handleEditStatus = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setNewStatus(agendamento.status);
    setEditDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await api.updateAgendamentoStatus(selectedAgendamento.id, newStatus, selectedAgendamento.dose);
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
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress sx={{ color: '#10b981' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Chip 
              label="Gestão de Agendamentos" 
              sx={{ 
                mb: 2, 
                fontWeight: 700,
                backgroundColor: '#dcfce7',
                color: '#065f46'
              }} 
            />
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                mb: 1,
                background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Administração de Agendamentos
            </Typography>
            <Typography variant="body1" sx={{ color: '#047857', mb: 4 }}>
              Gerencie agendamentos, confirme presenças e aplique vacinas
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleNovoAgendamento}
              sx={{
                borderColor: '#10b981',
                color: '#047857',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#047857',
                  backgroundColor: '#f0fdf4'
                }
              }}
            >
              Novo Agendamento
            </Button>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={loadAgendamentos}
              sx={{
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#047857' },
                fontWeight: 600
              }}
            >
              Atualizar
            </Button>
          </Box>
        </Box>

        {/* Filtros */}
        <Card sx={{ 
          mb: 4, 
          background: 'rgba(255, 255, 255, 0.95)', 
          border: '1px solid #d9f99d',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Buscar"
                  placeholder="Paciente, vacina ou local..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: '#047857' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#10b981' },
                      '&.Mui-focused fieldset': { borderColor: '#047857' }
                    }
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
                    sx={{
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#047857' }
                    }}
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
              <Grid item xs={12} md={5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ color: '#047857', fontWeight: 500 }}>
                    {filteredAgendamentos.length} agendamento(s) encontrado(s)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Lista de Agendamentos */}
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          border: '1px solid #d9f99d',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)',
          overflow: 'hidden'
        }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#065f46' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>Paciente</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>Vacina</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>Local</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>Data/Hora</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }} align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAgendamentos.map((agendamento) => (
                  <TableRow 
                    key={agendamento.id} 
                    hover 
                    sx={{ 
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        backgroundColor: '#f0fdf4',
                        transform: 'scale(1.001)'
                      }
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Person sx={{ color: '#047857', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#065f46' }}>
                          {agendamento.nomePaciente || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Vaccines sx={{ color: '#047857', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#047857' }}>
                          {agendamento.nomeVacina || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LocationOn sx={{ color: '#047857', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#047857' }}>
                          {agendamento.nomeLocal || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#065f46' }}>
                          {formatDate(agendamento.dataAgendamento)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#047857' }}>
                          {formatTime(agendamento.dataAgendamento)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip
                          label={agendamento.status}
                          color={statusColors[agendamento.status] || 'default'}
                          size="small"
                          variant="filled"
                          sx={{ fontWeight: 600 }}
                        />
                        {agendamento.status === 'Cancelado' && agendamento.motivoCancelamento && (
                          <Typography variant="caption" sx={{ display: 'block', color: '#dc2626', mt: 0.5, fontStyle: 'italic' }}>
                            Motivo: {agendamento.motivoCancelamento}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Ver Histórico de Vacinas">
                          <IconButton
                            size="small"
                            onClick={() => {
                              const paciente = usuarios.find(u => u.id === agendamento.pacienteId);
                              if (paciente) handleVerHistorico(paciente);
                            }}
                            sx={{ 
                              color: '#6366f1',
                              '&:hover': { 
                                backgroundColor: '#f0f9ff',
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            <History />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar Status">
                          <IconButton
                            size="small"
                            onClick={() => handleEditStatus(agendamento)}
                            sx={{ 
                              color: '#047857',
                              '&:hover': { 
                                backgroundColor: '#f0fdf4',
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancelar Agendamento">
                          <IconButton
                            size="small"
                            onClick={() => handleCancelAgendamento(agendamento)}
                            sx={{ 
                              color: '#dc2626',
                              '&:hover': { 
                                backgroundColor: '#fef2f2',
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Aplicar Vacina">
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Vaccines />}
                            onClick={() => handleRegisterVaccination(agendamento)}
                            sx={{
                              bgcolor: '#10b981',
                              color: 'white',
                              fontWeight: 600,
                              borderRadius: 2,
                              px: 2,
                              textTransform: 'none',
                              '&:hover': {
                                bgcolor: '#047857',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            Aplicar
                          </Button>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAgendamentos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="h6" sx={{ color: '#047857', fontWeight: 600 }}>
                        Nenhum agendamento encontrado
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                        Tente ajustar os filtros de busca
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>

      {/* Dialog de Edição de Status */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #d9f99d',
            boxShadow: '0 8px 32px rgba(6, 95, 70, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          color: '#065f46',
          borderBottom: '1px solid #d9f99d',
          pb: 2
        }}>
          Editar Status do Agendamento
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#047857', mb: 1 }}>
              <strong>Paciente:</strong> {selectedAgendamento?.nomePaciente}
            </Typography>
            <Typography variant="body2" sx={{ color: '#047857', mb: 1 }}>
              <strong>Vacina:</strong> {selectedAgendamento?.nomeVacina}
            </Typography>
            <Typography variant="body2" sx={{ color: '#047857', mb: 2 }}>
              <strong>Data:</strong> {selectedAgendamento && formatDateTime(selectedAgendamento.dataAgendamento)}
            </Typography>
          </Box>
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
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #d9f99d' }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: '#6b7280' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained"
            sx={{
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#047857' }
            }}
          >
            Atualizar
          </Button>
        </DialogActions>
      </Dialog>

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
        icon={<Vaccines sx={{ color: '#10b981', fontSize: 28 }} />}
      />

      {/* Modal de Confirmação de Cancelamento */}
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

      {/* Dialog Novo Agendamento */}
      <Dialog 
        open={newAgendamentoOpen} 
        onClose={() => setNewAgendamentoOpen(false)} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: '2px solid #10b981',
            boxShadow: '0 20px 60px rgba(6, 95, 70, 0.2)',
            minHeight: '600px'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 800, 
          fontSize: '2rem',
          color: '#065f46',
          textAlign: 'center',
          py: 4,
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <Event sx={{ fontSize: '2.5rem', color: '#10b981' }} />
          Novo Agendamento de Vacinação
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#047857', fontSize: '1.1rem' }}>
              Preencha os dados abaixo para criar um novo agendamento
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card sx={{ 
                p: 3, 
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #a7f3d0',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ color: '#10b981' }} />
                  Dados do Paciente
                </Typography>
                <FormControl fullWidth size="large">
                  <InputLabel sx={{ fontSize: '1.1rem' }}>Selecione o Paciente</InputLabel>
                  <Select
                    value={novoAgendamento.pacienteId}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, pacienteId: e.target.value})}
                    label="Selecione o Paciente"
                    sx={{ 
                      fontSize: '1.1rem',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#047857' }
                    }}
                  >
                    {usuarios.map(usuario => (
                      <MenuItem key={usuario.id} value={usuario.id} sx={{ fontSize: '1rem', py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Person sx={{ color: '#10b981' }} />
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>{usuario.nomeCompleto}</Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>{usuario.email}</Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                p: 3, 
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #a7f3d0',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Vaccines sx={{ color: '#10b981' }} />
                  Vacina
                </Typography>
                <FormControl fullWidth size="large">
                  <InputLabel sx={{ fontSize: '1.1rem' }}>Selecione a Vacina</InputLabel>
                  <Select
                    value={novoAgendamento.vacinaId}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, vacinaId: e.target.value})}
                    label="Selecione a Vacina"
                    sx={{ 
                      fontSize: '1.1rem',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' }
                    }}
                  >
                    {vacinas.map(vacina => (
                      <MenuItem key={vacina.id} value={vacina.id} sx={{ fontSize: '1rem', py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Vaccines sx={{ color: '#10b981' }} />
                          <Typography sx={{ fontWeight: 600 }}>{vacina.nome}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                p: 3, 
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #a7f3d0',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ color: '#10b981' }} />
                  Local
                </Typography>
                <FormControl fullWidth size="large">
                  <InputLabel sx={{ fontSize: '1.1rem' }}>Selecione o Local</InputLabel>
                  <Select
                    value={novoAgendamento.localId}
                    onChange={(e) => setNovoAgendamento({...novoAgendamento, localId: e.target.value})}
                    label="Selecione o Local"
                    sx={{ 
                      fontSize: '1.1rem',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' }
                    }}
                  >
                    {locais.map(local => (
                      <MenuItem key={local.id} value={local.id} sx={{ fontSize: '1rem', py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LocationOn sx={{ color: '#10b981' }} />
                          <Typography sx={{ fontWeight: 600 }}>{local.nome}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                p: 3, 
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #a7f3d0',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Event sx={{ color: '#10b981' }} />
                  Data e Hora
                </Typography>
                <TextField
                  fullWidth
                  size="large"
                  label="Selecione Data e Hora"
                  type="datetime-local"
                  value={novoAgendamento.dataAgendamento}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, dataAgendamento: e.target.value})}
                  InputLabelProps={{ shrink: true, sx: { fontSize: '1.1rem' } }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                      '& fieldset': { borderColor: '#10b981' }
                    }
                  }}
                />
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                p: 3, 
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #a7f3d0',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Vaccines sx={{ color: '#10b981' }} />
                  Dose (Opcional)
                </Typography>
                <TextField
                  fullWidth
                  size="large"
                  label="Especifique a dose"
                  value={novoAgendamento.dose}
                  onChange={(e) => setNovoAgendamento({...novoAgendamento, dose: e.target.value})}
                  placeholder="Ex: 1ª dose, 2ª dose, dose única"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                      '& fieldset': { borderColor: '#10b981' }
                    }
                  }}
                />
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 4, 
          borderTop: '2px solid #d9f99d',
          background: 'rgba(255, 255, 255, 0.5)',
          gap: 2,
          justifyContent: 'center'
        }}>
          <Button 
            onClick={() => setNewAgendamentoOpen(false)}
            size="large"
            sx={{ 
              color: '#6b7280',
              fontSize: '1.1rem',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: 3
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSalvarAgendamento} 
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#10b981',
              fontSize: '1.1rem',
              fontWeight: 700,
              px: 6,
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              '&:hover': { 
                backgroundColor: '#047857',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Confirmar Agendamento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Histórico de Vacinas */}
      <Dialog 
        open={historicoOpen} 
        onClose={() => setHistoricoOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #d9f99d',
            boxShadow: '0 8px 32px rgba(6, 95, 70, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          color: '#065f46',
          borderBottom: '1px solid #d9f99d',
          pb: 2
        }}>
          Histórico de Vacinação - {selectedPaciente?.nomeCompleto}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {historicoVacinas.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#047857', mb: 1 }}>
                Nenhuma vacinação registrada
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Este paciente ainda não possui histórico de vacinação
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#065f46' }}>Vacina</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#065f46' }}>Dose</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#065f46' }}>Data</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#065f46' }}>Local</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historicoVacinas.map((vacina, index) => (
                    <TableRow key={index}>
                      <TableCell>{vacina.nomeVacina || 'N/A'}</TableCell>
                      <TableCell>{vacina.dose || 'N/A'}</TableCell>
                      <TableCell>
                        {vacina.dataAplicacao ? new Date(vacina.dataAplicacao).toLocaleDateString('pt-BR') : 'N/A'}
                      </TableCell>
                      <TableCell>{vacina.nomeLocal || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #d9f99d' }}>
          <Button 
            onClick={() => setHistoricoOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#047857' }
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

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