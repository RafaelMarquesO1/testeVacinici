import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Tabs, Tab, Snackbar, Alert, CircularProgress, useTheme, Chip, FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl, Tooltip, Divider, Grid, Fade, Stack
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Close, Save, Person, Email, Phone, Badge, CalendarMonth, Wc, Work } from '@mui/icons-material';
import { WarningAmber } from '@mui/icons-material';
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(34,197,94,0.18)', border: '1.5px solid #C7F2E6', background: theme => theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #142D1F 0%, #1A3A2F 100%)' : 'linear-gradient(120deg, #F0FDF4 0%, #C7F2E6 100%)' } }}>
      <DialogTitle sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, bgcolor: theme => theme.palette.mode === 'dark' ? '#1A3A2F' : 'primary.main', color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.contrastText', borderTopLeftRadius: 3, borderTopRightRadius: 3, minHeight: 70, boxShadow: '0 2px 8px rgba(34,197,94,0.10)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Person sx={{ fontSize: 36, mr: 1 }} />
          <span>{form.id ? 'Editar Usuário' : 'Novo Usuário'}</span>
        </Box>
        <IconButton onClick={onClose} aria-label="fechar" sx={{ color: 'primary.contrastText', transition: '0.2s', '&:hover': { color: 'error.main', bgcolor: '#fff2f2' } }}>
          <Close sx={{ fontSize: 28 }} />
        </IconButton>
      </DialogTitle>
      <Divider />
  <DialogContent sx={{ pt: 3, background: theme => theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #1A3A2F 0%, #142D1F 100%)' : 'linear-gradient(120deg, #F3FDF7 0%, #E6F7EE 100%)', minHeight: 220 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Nome Completo" name="nomeCompleto" value={form.nomeCompleto || ''} onChange={handleChange} fullWidth required InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'primary.main' }} /> }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Email" name="email" value={form.email || ''} onChange={handleChange} fullWidth required InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'primary.main' }} /> }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Telefone" name="telefone" value={form.telefone || ''} onChange={handleChange} fullWidth InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: 'primary.main' }} /> }} />
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
              InputProps={{ startAdornment: <Badge sx={{ mr: 1, color: 'primary.main' }} /> }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Data de Nascimento" name="dataNascimento" type="date" value={form.dataNascimento || ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} /> }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Gênero" name="genero" value={form.genero || ''} onChange={handleChange} fullWidth InputProps={{ startAdornment: <Wc sx={{ mr: 1, color: 'primary.main' }} /> }} />
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
              <TextField label="Cargo" name="cargo" value={form.cargo || ''} onChange={handleChange} fullWidth InputProps={{ startAdornment: <Work sx={{ mr: 1, color: 'primary.main' }} /> }} />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <TextField label="Senha" name="senha" type="password" value={form.senha || ''} onChange={handleChange} fullWidth required />
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
  <DialogActions sx={{ p: 2, background: theme => theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #142D1F 0%, #1A3A2F 100%)' : 'linear-gradient(120deg, #E6F7EE 0%, #C7F2E6 100%)', borderBottomLeftRadius: 3, borderBottomRightRadius: 3, justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onClose} startIcon={<Close />} sx={{ fontWeight: 800, px: 4, borderRadius: 3, boxShadow: '0 2px 8px rgba(34,197,94,0.10)', bgcolor: '#fff', color: 'primary.main', transition: '0.2s', '&:hover': { bgcolor: '#F0FDF4', color: 'error.main' } }}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" startIcon={<Save />} sx={{ fontWeight: 800, px: 4, borderRadius: 3, boxShadow: '0 2px 8px rgba(34,197,94,0.10)', bgcolor: 'primary.main', color: '#fff', transition: '0.2s', '&:hover': { bgcolor: 'success.light', color: 'primary.main' } }}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}

function UserDetailDialog({ open, user, onClose }) {
  if (!user) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(34,197,94,0.18)', border: '1.5px solid #C7F2E6', background: theme => theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #142D1F 0%, #1A3A2F 100%)' : 'linear-gradient(120deg, #F0FDF4 0%, #C7F2E6 100%)' } }}>
      <DialogTitle sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, bgcolor: theme => theme.palette.mode === 'dark' ? '#1A3A2F' : 'primary.main', color: theme => theme.palette.mode === 'dark' ? 'primary.light' : 'primary.contrastText', borderTopLeftRadius: 3, borderTopRightRadius: 3, minHeight: 70, boxShadow: '0 2px 8px rgba(34,197,94,0.10)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Person sx={{ fontSize: 32, mr: 1 }} />
          <span>Detalhes do Usuário</span>
        </Box>
        <IconButton onClick={onClose} aria-label="fechar" sx={{ color: 'primary.contrastText', transition: '0.2s', '&:hover': { color: 'error.main', bgcolor: '#fff2f2' } }}>
          <Close sx={{ fontSize: 28 }} />
        </IconButton>
      </DialogTitle>
      <Divider />
  <DialogContent sx={{ pt: 3, background: theme => theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #1A3A2F 0%, #142D1F 100%)' : 'linear-gradient(120deg, #F3FDF7 0%, #E6F7EE 100%)', minHeight: 140 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'center' }}>
          <Avatar src={user.fotoPerfil} sx={{ width: 72, height: 72, border: '3px solid #34c77a', boxShadow: '0 2px 12px rgba(34,197,94,0.10)', bgcolor: '#fff' }} />
          <Box>
            <Typography variant="h6" fontWeight={900} color="primary.main">{user.nomeCompleto}</Typography>
            <Chip size="medium" label={user.tipoUsuario === 'Funcionario' ? 'Funcionário' : 'Paciente'} color={user.tipoUsuario === 'Funcionario' ? 'secondary' : 'default'} sx={{ mt: 0.5, fontWeight: 700 }} />
          </Box>
        </Box>
        <Grid container spacing={2}>
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
  <DialogActions sx={{ p: 2, background: theme => theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #142D1F 0%, #1A3A2F 100%)' : 'linear-gradient(120deg, #E6F7EE 0%, #C7F2E6 100%)', borderBottomLeftRadius: 3, borderBottomRightRadius: 3, justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="contained" sx={{ fontWeight: 800, px: 4, borderRadius: 3, boxShadow: '0 2px 8px rgba(34,197,94,0.10)', bgcolor: 'primary.main', color: '#fff', transition: '0.2s', '&:hover': { bgcolor: 'success.light', color: 'primary.main' } }}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function UsersPage() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
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
  setUserToDelete(user);
  setDeleteOpen(true);
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
    <Box sx={{ minHeight: '100vh', background: theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #0A1F12 0%, #0F2A18 100%)' : 'linear-gradient(120deg, #F0FDF4 0%, #ECFDF5 100%)', p: { xs: 1, md: 3 } }}>
      {/* Cabeçalho com avatar e título */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56, fontWeight: 700, fontSize: 32 }}>U</Avatar>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: theme.palette.primary.main, letterSpacing: 0.5 }}>
              Usuários do Sistema
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Gerencie pacientes e funcionários com facilidade e segurança
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel control={<Switch checked={dense} onChange={(_, v) => setDense(v)} />} label="Denso" />
          <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ borderRadius: 2, fontWeight: 700, px: 4, py: 1.5 }}>
            Adicionar Novo
          </Button>
        </Box>
      </Box>
      <Tabs value={tab} onChange={handleTabChange} sx={{ minHeight: 48, mb: 2 }}>
        <Tab label="Pacientes" sx={{ fontWeight: 600, fontSize: '1rem' }} />
        <Tab label="Funcionários" sx={{ fontWeight: 600, fontSize: '1rem' }} />
      </Tabs>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <Fade in timeout={600}>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 32px 0 rgba(60,72,100,0.10)', background: theme.palette.mode === 'dark' ? '#10291A' : '#F7FFF9' }}>
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
                  <TableRow key={user.id} hover sx={{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 2px 12px rgba(34,197,94,0.10)' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={user.fotoPerfil} sx={{ border: '2px solid #e3eafc', width: 40, height: 40, mr: 1 }} />
                        <Box>
                          <Typography fontWeight={700} fontSize={16}>{user.nomeCompleto}</Typography>
                          <Chip size="small" label={user.tipoUsuario === 'Funcionario' ? 'Funcionário' : 'Paciente'} color={user.tipoUsuario === 'Funcionario' ? 'secondary' : 'default'} sx={{ mt: 0.5, fontWeight: 600, fontSize: 12, letterSpacing: 0.2, display: { md: 'none' } }} />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.email}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{user.cpf}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{user.dataNascimento}</TableCell>
                    {tab === 1 && <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{user.cargo}</TableCell>}
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Ver detalhes"><IconButton aria-label={`ver detalhes de ${user.nomeCompleto}`} onClick={() => { setSelected(user); setDetailOpen(true); }} color="info"><Visibility /></IconButton></Tooltip>
                        <Tooltip title="Editar"><IconButton aria-label={`editar ${user.nomeCompleto}`} onClick={() => handleEdit(user)} color="primary"><Edit /></IconButton></Tooltip>
                        <Tooltip title="Excluir"><IconButton aria-label={`excluir ${user.nomeCompleto}`} onClick={() => handleDelete(user)} color="error"><Delete /></IconButton></Tooltip>
                      </Stack>
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
        </Fade>
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
      {/* Modal de confirmação de exclusão */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(255,0,0,0.18)', border: '1.5px solid #F2C7C7', background: theme => theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #4B2323 0%, #2B1A1A 100%)' : 'linear-gradient(120deg, #FFF6F6 0%, #F2C7C7 100%)' } }}>
        <DialogTitle sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, bgcolor: theme => theme.palette.mode === 'dark' ? '#4B2323' : 'error.main', color: theme => theme.palette.mode === 'dark' ? 'error.light' : 'error.contrastText', borderTopLeftRadius: 3, borderTopRightRadius: 3, minHeight: 70, boxShadow: '0 2px 8px rgba(255,0,0,0.10)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WarningAmber sx={{ fontSize: 32, mr: 1 }} />
            <span>Confirmar exclusão</span>
          </Box>
          <IconButton onClick={() => setDeleteOpen(false)} aria-label="fechar" sx={{ color: 'error.contrastText', transition: '0.2s', '&:hover': { color: 'primary.main', bgcolor: '#fff2f2' } }}>
            <Close sx={{ fontSize: 28 }} />
          </IconButton>
        </DialogTitle>
        <Divider />
  <DialogContent sx={{ py: 3, background: theme => theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #4B2323 0%, #2B1A1A 100%)' : 'linear-gradient(120deg, #FFF6F6 0%, #F2C7C7 100%)', textAlign: 'center', minHeight: 100 }}>
          <Typography variant="h6" fontWeight={900} color="error.main" sx={{ mb: 2 }}>
            Tem certeza que deseja excluir o usuário?
          </Typography>
          {userToDelete && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Avatar src={userToDelete.fotoPerfil} sx={{ width: 56, height: 56, border: '3px solid #F2C7C7', boxShadow: '0 2px 12px rgba(255,0,0,0.10)', bgcolor: '#fff' }} />
              <Typography fontWeight={900} color="text.primary" fontSize={18}>{userToDelete.nomeCompleto}</Typography>
            </Box>
          )}
          <Typography color="text.secondary" fontWeight={700}>Esta ação não pode ser desfeita.</Typography>
        </DialogContent>
        <Divider />
  <DialogActions sx={{ p: 2, background: theme => theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #2B1A1A 0%, #4B2323 100%)' : 'linear-gradient(120deg, #F2C7C7 0%, #FFF6F6 100%)', borderBottomLeftRadius: 3, borderBottomRightRadius: 3, justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} startIcon={<Close />} sx={{ fontWeight: 800, px: 4, borderRadius: 3, boxShadow: '0 2px 8px rgba(255,0,0,0.10)', bgcolor: '#fff', color: 'error.main', transition: '0.2s', '&:hover': { bgcolor: '#F2C7C7', color: 'primary.main' } }}>Cancelar</Button>
          <Button
            onClick={async () => {
              setDeleteOpen(false);
              if (userToDelete) {
                const originalUsers = users;
                try {
                  setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
                  await api.deleteUsuario(userToDelete.id);
                  setSnack({ open: true, msg: 'Usuário excluído com sucesso!', severity: 'success' });
                } catch (error) {
                  setUsers(originalUsers);
                  setSnack({ open: true, msg: 'Erro ao excluir usuário', severity: 'error' });
                }
                setUserToDelete(null);
              }
            }}
            variant="contained"
            color="error"
            startIcon={<Delete />}
            sx={{ fontWeight: 800, px: 4, borderRadius: 3, boxShadow: '0 2px 8px rgba(255,0,0,0.10)', bgcolor: 'error.main', color: '#fff', transition: '0.2s', '&:hover': { bgcolor: '#fff', color: 'error.main' } }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
