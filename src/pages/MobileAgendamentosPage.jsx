import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Chip, Container, Stack
} from '@mui/material';
import { Event, Vaccines, LocationOn, Cancel, CheckCircle } from '@mui/icons-material';
import { api } from '../services/api';
import CancelamentoModal from '../components/shared/CancelamentoModal';

export default function MobileAgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [cancelamentoOpen, setCancelamentoOpen] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simular usuário logado (paciente)
  const pacienteId = 1; // ID do paciente logado

  useEffect(() => {
    loadAgendamentos();
  }, []);

  const loadAgendamentos = async () => {
    try {
      setLoading(true);
      const data = await api.getAgendamentos();
      // Filtrar apenas agendamentos do paciente logado
      const agendamentosPaciente = data.filter(a => a.pacienteId === pacienteId);
      setAgendamentos(agendamentosPaciente);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarAgendamento = (agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setCancelamentoOpen(true);
  };

  const handleConfirmarCancelamento = async (motivo) => {
    try {
      await api.updateAgendamentoStatus(agendamentoSelecionado.id, 'Cancelado', null, motivo);
      await loadAgendamentos();
      alert('Agendamento cancelado com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Erro ao cancelar agendamento. Tente novamente.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Agendado': 'primary',
      'Confirmado': 'success',
      'Realizado': 'info',
      'Cancelado': 'error'
    };
    return colors[status] || 'default';
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('pt-BR');
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
        <Typography>Carregando agendamentos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      py: 2
    }}>
      <Container maxWidth="sm">
        {/* Header Mobile */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}
          >
            📱 Meus Agendamentos
          </Typography>
          <Typography variant="body2" sx={{ color: '#047857' }}>
            Visualização Mobile - App do Paciente
          </Typography>
        </Box>

        {/* Lista de Agendamentos */}
        <Stack spacing={2}>
          {agendamentos.length === 0 ? (
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #d9f99d',
              borderRadius: 3,
              textAlign: 'center'
            }}>
              <CardContent sx={{ py: 4 }}>
                <Event sx={{ fontSize: 60, color: '#d1d5db', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
                  Nenhum agendamento
                </Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  Você não possui agendamentos no momento
                </Typography>
              </CardContent>
            </Card>
          ) : (
            agendamentos.map((agendamento) => (
              <Card 
                key={agendamento.id}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #d9f99d',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(6, 95, 70, 0.1)',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(6, 95, 70, 0.15)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Status */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={agendamento.status}
                      color={getStatusColor(agendamento.status)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      ID: {agendamento.id}
                    </Typography>
                  </Box>

                  {/* Vacina */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Vaccines sx={{ color: '#10b981', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#065f46' }}>
                      {agendamento.nomeVacina || 'Vacina'}
                    </Typography>
                  </Box>

                  {/* Data e Hora */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Event sx={{ color: '#047857', fontSize: 20 }} />
                    <Typography variant="body1" sx={{ color: '#047857' }}>
                      {formatDateTime(agendamento.dataAgendamento)}
                    </Typography>
                  </Box>

                  {/* Local */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <LocationOn sx={{ color: '#047857', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#047857' }}>
                      {agendamento.nomeLocal || 'Local de Vacinação'}
                    </Typography>
                  </Box>

                  {/* Dose */}
                  {agendamento.dose && (
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={`Dose: ${agendamento.dose}`}
                        size="small"
                        sx={{ 
                          backgroundColor: '#dcfce7',
                          color: '#065f46'
                        }}
                      />
                    </Box>
                  )}

                  {/* Motivo do Cancelamento */}
                  {agendamento.status === 'Cancelado' && agendamento.motivoCancelamento && (
                    <Box sx={{ 
                      mb: 2, 
                      p: 2, 
                      backgroundColor: '#fef2f2', 
                      borderRadius: 2,
                      border: '1px solid #fecaca'
                    }}>
                      <Typography variant="caption" sx={{ color: '#7f1d1d', fontWeight: 600 }}>
                        Motivo do cancelamento:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#dc2626', fontStyle: 'italic' }}>
                        {agendamento.motivoCancelamento}
                      </Typography>
                    </Box>
                  )}

                  {/* Ações */}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {(agendamento.status === 'Agendado' || agendamento.status === 'Confirmado') && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => handleCancelarAgendamento(agendamento)}
                        sx={{
                          borderColor: '#dc2626',
                          color: '#dc2626',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#b91c1c',
                            backgroundColor: '#fef2f2'
                          }
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                    {agendamento.status === 'Realizado' && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Vacina Aplicada"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                    {agendamento.status === 'Cancelado' && (
                      <Chip
                        icon={<Cancel />}
                        label="Cancelado"
                        color="error"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>

        {/* Modal de Cancelamento */}
        <CancelamentoModal
          open={cancelamentoOpen}
          onClose={() => setCancelamentoOpen(false)}
          onConfirm={handleConfirmarCancelamento}
          agendamento={agendamentoSelecionado}
        />
      </Container>
    </Box>
  );
}