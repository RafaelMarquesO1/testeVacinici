import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, 
  TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, Chip, Container, Divider
} from '@mui/material';
import {
  Person, Vaccines, Search, Refresh, Badge, CalendarToday, LocationOn
} from '@mui/icons-material';
import { api } from '../services/api';

export default function CarteirinhaPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [pacienteData, setPacienteData] = useState(null);
  const [historicoVacinas, setHistoricoVacinas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const data = await api.getUsuarios();
      setUsuarios(data.filter(u => u.tipoUsuario === 'Paciente'));
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const handleSelectPaciente = async (pacienteId) => {
    if (!pacienteId) return;
    
    try {
      setLoading(true);
      setSelectedPaciente(pacienteId);
      
      const paciente = usuarios.find(u => u.id === parseInt(pacienteId));
      setPacienteData(paciente);
      
      const historico = await api.getHistoricoVacinacao(pacienteId);
      setHistoricoVacinas(historico);
    } catch (error) {
      console.error('Erro ao carregar dados do paciente:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Corrigir timezone para evitar erro de data (um dia a menos)
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return 'N/A';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return `${idade} anos`;
  };

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
              label="Carteirinha de Vacinação" 
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
              Carteirinha Digital
            </Typography>
            <Typography variant="body1" sx={{ color: '#047857', mb: 4 }}>
              Visualize o histórico completo de vacinação dos pacientes
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadUsuarios}
            sx={{
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#047857' },
              fontWeight: 600
            }}
          >
            Atualizar
          </Button>
        </Box>

        {/* Seleção de Paciente */}
        <Card sx={{ 
          mb: 4, 
          background: 'rgba(255, 255, 255, 0.95)', 
          border: '1px solid #d9f99d',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Search sx={{ color: '#10b981' }} />
              Selecionar Paciente
            </Typography>
            <FormControl fullWidth size="large">
              <InputLabel>Escolha um paciente</InputLabel>
              <Select
                value={selectedPaciente}
                onChange={(e) => handleSelectPaciente(e.target.value)}
                label="Escolha um paciente"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#10b981' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#047857' }
                }}
              >
                {usuarios.map(usuario => (
                  <MenuItem key={usuario.id} value={usuario.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={usuario.fotoPerfil} sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>{usuario.nomeCompleto}</Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          CPF: {usuario.cpf}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {/* Carteirinha do Paciente */}
        {pacienteData && (
          <Grid container spacing={4}>
            {/* Dados do Paciente */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                color: 'white',
                borderRadius: 4,
                boxShadow: '0 12px 40px rgba(6, 95, 70, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)'
                }} />
                <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar 
                      src={pacienteData.fotoPerfil} 
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mx: 'auto', 
                        mb: 2,
                        border: '4px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                      }} 
                    />
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {pacienteData.nomeCompleto}
                    </Typography>
                    <Chip 
                      label="CARTEIRINHA DIGITAL" 
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                  
                  <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', my: 3 }} />
                  
                  <Box sx={{ space: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Badge sx={{ fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>CPF</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {pacienteData.cpf}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CalendarToday sx={{ fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>Nascimento</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formatDate(pacienteData.dataNascimento)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>Idade</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {calcularIdade(pacienteData.dataNascimento)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Histórico de Vacinas */}
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #d9f99d',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ mb: 3, color: '#065f46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Vaccines sx={{ color: '#10b981' }} />
                    Histórico de Vacinação
                  </Typography>
                  
                  {loading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography>Carregando...</Typography>
                    </Box>
                  ) : historicoVacinas.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Vaccines sx={{ fontSize: 60, color: '#d1d5db', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#6b7280', mb: 1 }}>
                        Nenhuma vacinação registrada
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        Este paciente ainda não possui histórico de vacinação
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, color: '#065f46', fontSize: '1rem' }}>Vacina</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#065f46', fontSize: '1rem' }}>Dose</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#065f46', fontSize: '1rem' }}>Data</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#065f46', fontSize: '1rem' }}>Local</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#065f46', fontSize: '1rem' }}>Lote</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {historicoVacinas.map((vacina, index) => (
                            <TableRow 
                              key={index}
                              sx={{ 
                                '&:hover': { backgroundColor: '#f0fdf4' },
                                borderLeft: '4px solid #10b981'
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Vaccines sx={{ color: '#10b981', fontSize: 20 }} />
                                  <Typography sx={{ fontWeight: 600, color: '#065f46' }}>
                                    {vacina.nomeVacina || 'N/A'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={vacina.dose || 'N/A'} 
                                  size="small"
                                  sx={{ 
                                    backgroundColor: '#dcfce7',
                                    color: '#065f46',
                                    fontWeight: 600
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography sx={{ fontWeight: 500 }}>
                                  {formatDate(vacina.dataAplicacao)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocationOn sx={{ color: '#6b7280', fontSize: 16 }} />
                                  <Typography sx={{ color: '#047857' }}>
                                    {vacina.nomeLocal || 'N/A'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ 
                                  fontFamily: 'monospace',
                                  backgroundColor: '#f3f4f6',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  display: 'inline-block'
                                }}>
                                  {vacina.lote || 'N/A'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {!pacienteData && (
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            border: '2px dashed #d9f99d',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)'
          }}>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <Person sx={{ fontSize: 80, color: '#d1d5db', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#6b7280', mb: 1, fontWeight: 600 }}>
                Selecione um paciente
              </Typography>
              <Typography variant="body1" sx={{ color: '#9ca3af' }}>
                Escolha um paciente na lista acima para visualizar sua carteirinha de vacinação
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}