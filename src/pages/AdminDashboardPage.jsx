import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Container, Chip, Button, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Alert
} from '@mui/material';
import { 
  People, Group, Vaccines, CalendarToday, Add, Edit, Delete, Refresh 
} from '@mui/icons-material';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboardPage() {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalPacientes: 0,
    totalFuncionarios: 0,
    totalVacinas: 0,
    agendamentosHoje: 0
  });
  
  // Estados para CRUD
  const [usuarios, setUsuarios] = useState([]);
  const [vacinas, setVacinas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  
  // Estados para modais
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'usuario', 'vacina', 'local'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [usuariosData, vacinasData, locaisData, agendamentosData] = await Promise.all([
        api.getUsuarios(),
        api.getVacinas(),
        api.getLocaisVacinacao(),
        api.getAgendamentos()
      ]);

      setUsuarios(usuariosData);
      setVacinas(vacinasData);
      setLocais(locaisData);
      setAgendamentos(agendamentosData);

      setStats({
        totalPacientes: usuariosData.filter(u => u.tipoUsuario === 'Paciente').length,
        totalFuncionarios: usuariosData.filter(u => u.tipoUsuario === 'Funcionario').length,
        totalVacinas: vacinasData.length,
        agendamentosHoje: agendamentosData.filter(a => {
          const hoje = new Date().toISOString().split('T')[0];
          return a.dataAgendamento?.startsWith(hoje);
        }).length
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openCreateModal = (type) => {
    setModalType(type);
    setEditingItem(null);
    setFormData({});
    setOpenModal(true);
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item);
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (modalType === 'usuario') {
        if (editingItem) {
          await api.updateUsuario(editingItem.id, formData);
        } else {
          await api.createUsuario(formData);
        }
      } else if (modalType === 'vacina') {
        if (editingItem) {
          await api.updateVacina(editingItem.id, formData);
        } else {
          await api.createVacina(formData);
        }
      } else if (modalType === 'local') {
        if (editingItem) {
          await api.updateLocal(editingItem.id, formData);
        } else {
          await api.createLocal(formData);
        }
      }
      
      setOpenModal(false);
      loadDashboardData();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setError('Erro ao salvar item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    
    try {
      setLoading(true);
      
      if (type === 'usuario') {
        await api.deleteUsuario(id);
      } else if (type === 'vacina') {
        await api.deleteVacina(id);
      } else if (type === 'local') {
        await api.deleteLocal(id);
      }
      
      loadDashboardData();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      setError('Erro ao excluir item');
    } finally {
      setLoading(false);
    }
  };

  const renderUsuariosTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Cargo</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell>{usuario.nomeCompleto}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>{usuario.cpf}</TableCell>
              <TableCell>{usuario.tipoUsuario}</TableCell>
              <TableCell>{usuario.cargo || '-'}</TableCell>
              <TableCell>
                <IconButton onClick={() => openEditModal('usuario', usuario)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete('usuario', usuario.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderVacinasTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Fabricante</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Doses</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vacinas.map((vacina) => (
            <TableRow key={vacina.id}>
              <TableCell>{vacina.nome}</TableCell>
              <TableCell>{vacina.fabricante}</TableCell>
              <TableCell>{vacina.descricao}</TableCell>
              <TableCell>{vacina.dosesRecomendadas}</TableCell>
              <TableCell>{vacina.categoria}</TableCell>
              <TableCell>
                <IconButton onClick={() => openEditModal('vacina', vacina)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete('vacina', vacina.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderLocaisTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Endereço</TableCell>
            <TableCell>Cidade</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {locais.map((local) => (
            <TableRow key={local.id}>
              <TableCell>{local.nome}</TableCell>
              <TableCell>{local.endereco}</TableCell>
              <TableCell>{local.cidade}</TableCell>
              <TableCell>{local.estado}</TableCell>
              <TableCell>{local.tipo}</TableCell>
              <TableCell>
                <IconButton onClick={() => openEditModal('local', local)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete('local', local.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderModal = () => (
    <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingItem ? 'Editar' : 'Criar'} {modalType === 'usuario' ? 'Usuário' : modalType === 'vacina' ? 'Vacina' : 'Local'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {modalType === 'usuario' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  value={formData.nomeCompleto || ''}
                  onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CPF"
                  value={formData.cpf || ''}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Usuário</InputLabel>
                  <Select
                    value={formData.tipoUsuario || ''}
                    onChange={(e) => setFormData({...formData, tipoUsuario: e.target.value})}
                  >
                    <MenuItem value="Paciente">Paciente</MenuItem>
                    <MenuItem value="Funcionario">Funcionário</MenuItem>
                    <MenuItem value="Administrador">Administrador</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={formData.telefone || ''}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                />
              </Grid>
              {!editingItem && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Senha"
                    type="password"
                    value={formData.senha || ''}
                    onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  />
                </Grid>
              )}
            </Grid>
          )}
          
          {modalType === 'vacina' && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fabricante"
                  value={formData.fabricante || ''}
                  onChange={(e) => setFormData({...formData, fabricante: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  multiline
                  rows={3}
                  value={formData.descricao || ''}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Doses Recomendadas"
                  type="number"
                  value={formData.dosesRecomendadas || ''}
                  onChange={(e) => setFormData({...formData, dosesRecomendadas: parseInt(e.target.value)})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={formData.categoria || ''}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  >
                    <MenuItem value="obrigatória">Obrigatória</MenuItem>
                    <MenuItem value="sazonal">Sazonal</MenuItem>
                    <MenuItem value="opcional">Opcional</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
          
          {modalType === 'local' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Endereço"
                  value={formData.endereco || ''}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cidade"
                  value={formData.cidade || ''}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estado"
                  value={formData.estado || ''}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={formData.tipo || ''}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  >
                    <MenuItem value="posto de saúde">Posto de Saúde</MenuItem>
                    <MenuItem value="hospital">Hospital</MenuItem>
                    <MenuItem value="clínica">Clínica</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (loading && tabValue === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h5" sx={{ color: '#047857' }}>Carregando dashboard...</Typography>
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Chip 
              label="Painel Administrativo" 
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
              Dashboard Admin
            </Typography>
            <Typography variant="body1" sx={{ color: '#047857', mb: 4 }}>
              Bem-vindo, {currentUser?.nomeCompleto}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={loadDashboardData}
            sx={{
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#047857' },
              fontWeight: 600
            }}
          >
            Atualizar
          </Button>
        </Box>

        {/* Cards de Estatísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #d9f99d',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: '#dcfce7',
                    color: '#065f46'
                  }}>
                    <People fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#065f46' }}>
                      {stats.totalPacientes}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#047857' }}>
                      Pacientes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #d9f99d',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: '#dcfce7',
                    color: '#065f46'
                  }}>
                    <Group fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#065f46' }}>
                      {stats.totalFuncionarios}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#047857' }}>
                      Funcionários
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #d9f99d',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: '#dcfce7',
                    color: '#065f46'
                  }}>
                    <Vaccines fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#065f46' }}>
                      {stats.totalVacinas}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#047857' }}>
                      Tipos de Vacinas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #d9f99d',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: '#dcfce7',
                    color: '#065f46'
                  }}>
                    <CalendarToday fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#065f46' }}>
                      {stats.agendamentosHoje}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#047857' }}>
                      Agendamentos Hoje
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs para CRUD */}
        <Card sx={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Usuários" />
              <Tab label="Vacinas" />
              <Tab label="Locais" />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                {tabValue === 0 ? 'Gerenciar Usuários' : tabValue === 1 ? 'Gerenciar Vacinas' : 'Gerenciar Locais'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => openCreateModal(tabValue === 0 ? 'usuario' : tabValue === 1 ? 'vacina' : 'local')}
                sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#047857' } }}
              >
                Adicionar {tabValue === 0 ? 'Usuário' : tabValue === 1 ? 'Vacina' : 'Local'}
              </Button>
            </Box>
            
            {tabValue === 0 && renderUsuariosTable()}
            {tabValue === 1 && renderVacinasTable()}
            {tabValue === 2 && renderLocaisTable()}
          </Box>
        </Card>

        {renderModal()}
      </Container>
    </Box>
  );
}