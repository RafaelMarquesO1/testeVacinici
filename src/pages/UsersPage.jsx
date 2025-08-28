import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Tabs, Tab, Snackbar, Alert, CircularProgress, useTheme, Chip, FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl, Tooltip, Divider, Grid
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Close, Save, Person, Email, Phone, Badge, CalendarMonth, Wc, Work } from '@mui/icons-material';
import { api } from '../services/api';

function UserForm({ open, onClose, onSubmit, initialData, isStaff }) {
  const [form, setForm] = useState(initialData || {});
  useEffect(() => { setForm(initialData || {}); }, [initialData]);
  const handleChange = e => {
    let { name, value } = e.target;
    
    // Formatação automática do CPF
    if (name === 'cpf') {
      value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
      value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona primeiro ponto
      value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona segundo ponto
      value = value.replace(/(\d{3})-(\d{1,2})$/, '$1-$2'); // Adiciona hífen
      value = value.replace(/(\d{3})(\d{2})$/, '$1-$2'); // Adiciona hífen
    }
    
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleSubmit = () => onSubmit(form);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {form.id ? 'Editar Usuário' : 'Novo Usuário'}
        <IconButton onClick={onClose} aria-label="fechar">
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Nome Completo" name="nomeCompleto" value={form.nomeCompleto || ''} onChange={handleChange} fullWidth required InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Email" name="email" value={form.email || ''} onChange={handleChange} fullWidth required InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Telefone" name="telefone" value={form.telefone || ''} onChange={handleChange} fullWidth InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField 
              label="CPF" 
              name="cpf" 
              value={form.cpf || ''} 
              onChange={handleChange} 
              fullWidth 
              placeholder="000.000.000-00"
              inputProps={{ maxLength: 14 }}
              InputProps={{ startAdornment: <Badge sx={{ mr: 1, color: 'text.secondary' }} /> }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Data de Nascimento" name="dataNascimento" type="date" value={form.dataNascimento || ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <CalendarMonth sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Gênero" name="genero" value={form.genero || ''} onChange={handleChange} fullWidth InputProps={{ startAdornment: <Wc sx={{ mr: 1, color: 'text.secondary' }} /> }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="tipo-usuario-label">Tipo de Usuário</InputLabel>
              <Select
                labelId="tipo-usuario-label"
                label="Tipo de Usuário"
                name="tipoUsuario"
                value={form.tipoUsuario || (isStaff ? 'Funcionario' : 'Paciente')}
                onChange={handleChange}
              >
                <MenuItem value="Paciente">Paciente</MenuItem>
                <MenuItem value="Funcionario">Funcionário</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {form.tipoUsuario === 'Funcionario' && (
            <Grid item xs={12} md={6}>
              <TextField label="Cargo" name="cargo" value={form.cargo || ''} onChange={handleChange} fullWidth InputProps={{ startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} /> }} />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <TextField label="Senha" name="senha" type="password" value={form.senha || ''} onChange={handleChange} fullWidth required />
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} startIcon={<Close />}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" startIcon={<Save />}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}

function UserDetailDialog({ open, user, onClose }) {
  if (!user) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Detalhes do Usuário
        <IconButton onClick={onClose} aria-label="fechar">
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar src={user.fotoPerfil} sx={{ width: 64, height: 64, border: '2px solid #e3eafc' }} />
          <Box>
            <Typography variant="h6" fontWeight={800}>{user.nomeCompleto}</Typography>
            <Chip size="small" label={user.tipoUsuario === 'Funcionario' ? 'Funcionário' : 'Paciente'} color={user.tipoUsuario === 'Funcionario' ? 'secondary' : 'default'} sx={{ mt: 0.5 }} />
          </Box>
        </Box>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">Email</Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Email fontSize="small" />{user.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">Telefone</Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Phone fontSize="small" />{user.telefone || '-'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">CPF</Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Badge fontSize="small" />{user.cpf}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">Nascimento</Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CalendarMonth fontSize="small" />{user.dataNascimento}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">Gênero</Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Wc fontSize="small" />{user.genero || '-'}</Typography>
          </Grid>
          {user.cargo && (
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Cargo</Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Work fontSize="small" />{user.cargo}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} variant="contained">Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function UsersPage() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dense, setDense] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState(null);
  const [isStaff, setIsStaff] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsuarios();
      console.log('Usuários carregados:', data);
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setSnack({ open: true, msg: 'Erro ao carregar usuários', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleTabChange = (_, v) => {
    setTab(v);
    setIsStaff(v === 1);
  };

  const filteredUsers = users.filter(u => (tab === 0 ? u.tipoUsuario === 'Paciente' : u.tipoUsuario === 'Funcionario'));

  const handleAdd = () => {
    setFormInitial({ tipoUsuario: tab === 0 ? 'Paciente' : 'Funcionario' });
    setFormOpen(true);
  };

  const handleEdit = user => {
    setFormInitial(user);
    setFormOpen(true);
  };

  const handleDelete = async user => {
    if (window.confirm(`Deseja excluir o usuário ${user.nomeCompleto}?`)) {
      const originalUsers = users;
      try {
        // Remove o usuário da lista local ANTES da chamada da API para atualização instantânea
        setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
        
        // Chama a API para deletar no backend
        await api.deleteUsuario(user.id);
        
        setSnack({ open: true, msg: 'Usuário excluído com sucesso!', severity: 'success' });
      } catch (error) {
        console.error('Erro ao excluir:', error);
        // Se der erro, restaura a lista original
        setUsers(originalUsers);
        setSnack({ open: true, msg: 'Erro ao excluir usuário', severity: 'error' });
      }
    }
  };

  const handleFormSubmit = async data => {
    try {
      // Validação básica
      if (!data.nomeCompleto || !data.email || !data.cpf || !data.tipoUsuario || !data.senha) {
        setSnack({ open: true, msg: 'Preencha todos os campos obrigatórios', severity: 'error' });
        return;
      }

      // Validação de CPF
      if (data.cpf.length !== 14) {
        setSnack({ open: true, msg: 'CPF deve ter 11 dígitos', severity: 'error' });
        return;
      }

      if (data.id) {
        const updatedUser = await api.updateUsuario(data.id, data);
        // Atualiza o usuário na lista local imediatamente
        setUsers(prevUsers => 
          prevUsers.map(user => user.id === data.id ? updatedUser : user)
        );
        setSnack({ open: true, msg: 'Usuário atualizado com sucesso!', severity: 'success' });
      } else {
        const newUser = await api.createUsuario(data);
        // Adiciona o novo usuário à lista local imediatamente
        setUsers(prevUsers => {
          const updatedList = [...prevUsers, newUser];
          console.log('Lista atualizada com novo usuário:', updatedList);
          return updatedList;
        });
        setSnack({ open: true, msg: 'Usuário criado com sucesso!', severity: 'success' });
      }
      setFormOpen(false);
      setFormInitial(null);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Erro ao salvar usuário';
      setSnack({ open: true, msg: errorMsg, severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: theme.palette.primary.main }}>
        Usuários do Sistema
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Tabs value={tab} onChange={handleTabChange} sx={{ minHeight: 48 }}>
          <Tab label="Pacientes" sx={{ fontWeight: 600, fontSize: '1rem' }} />
          <Tab label="Funcionários" sx={{ fontWeight: 600, fontSize: '1rem' }} />
        </Tabs>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel control={<Switch checked={dense} onChange={(_, v) => setDense(v)} />} label="Denso" />
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ borderRadius: 2, fontWeight: 700 }}>
            Adicionar Novo
          </Button>
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 32px 0 rgba(60,72,100,0.10)' }}>
          <Table size={dense ? 'small' : 'medium'} aria-label="Tabela de usuários">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main, display: { xs: 'none', md: 'table-cell' } }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main, display: { xs: 'none', md: 'table-cell' } }}>CPF</TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main, display: { xs: 'none', lg: 'table-cell' } }}>Data de Nascimento</TableCell>
                {tab === 1 && <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main, display: { xs: 'none', lg: 'table-cell' } }}>Cargo</TableCell>}
                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={user.fotoPerfil} sx={{ border: '2px solid #e3eafc' }} />
                      <Box>
                        <Typography fontWeight={600}>{user.nomeCompleto}</Typography>
                        <Chip size="small" label={user.tipoUsuario === 'Funcionario' ? 'Funcionário' : 'Paciente'} color={user.tipoUsuario === 'Funcionario' ? 'secondary' : 'default'} sx={{ mt: 0.5, display: { md: 'none' } }} />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.email}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.cpf}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{user.dataNascimento}</TableCell>
                  {tab === 1 && <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{user.cargo}</TableCell>}
                  <TableCell>
                    <Tooltip title="Ver detalhes"><IconButton aria-label={`ver detalhes de ${user.nomeCompleto}`} onClick={() => { setSelected(user); setDetailOpen(true); }} color="info"><Visibility /></IconButton></Tooltip>
                    <Tooltip title="Editar"><IconButton aria-label={`editar ${user.nomeCompleto}`} onClick={() => handleEdit(user)} color="primary"><Edit /></IconButton></Tooltip>
                    <Tooltip title="Excluir"><IconButton aria-label={`excluir ${user.nomeCompleto}`} onClick={() => handleDelete(user)} color="error"><Delete /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={tab === 1 ? 6 : 5} align="center">Nenhum usuário encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <UserForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setFormInitial(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={formInitial}
        isStaff={isStaff}
      />
      <UserDetailDialog open={detailOpen} user={selected} onClose={() => setDetailOpen(false)} />
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
