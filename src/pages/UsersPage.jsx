import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Tabs, Tab, Snackbar, Alert, CircularProgress, useTheme
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { api } from '../services/api';

function UserForm({ open, onClose, onSubmit, initialData, isStaff }) {
  const [form, setForm] = useState(initialData || {});
  useEffect(() => { setForm(initialData || {}); }, [initialData]);
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = () => onSubmit(form);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{form.id ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Nome Completo" name="nome_completo" value={form.nome_completo || ''} onChange={handleChange} fullWidth required />
          <TextField label="Email" name="email" value={form.email || ''} onChange={handleChange} fullWidth required />
          <TextField label="Telefone" name="telefone" value={form.telefone || ''} onChange={handleChange} fullWidth />
          <TextField label="CPF" name="cpf" value={form.cpf || ''} onChange={handleChange} fullWidth />
          <TextField label="Data de Nascimento" name="data_nascimento" type="date" value={form.data_nascimento || ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Gênero" name="genero" value={form.genero || ''} onChange={handleChange} fullWidth />
          <TextField
            select
            label="Tipo de Usuário"
            name="tipo_usuario"
            value={form.tipo_usuario || (isStaff ? 'Funcionario' : 'Paciente')}
            onChange={handleChange}
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value="Paciente">Paciente</option>
            <option value="Funcionario">Funcionário</option>
          </TextField>
          {isStaff && (
            <TextField label="Cargo" name="cargo" value={form.cargo || ''} onChange={handleChange} fullWidth />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}

function UserDetailDialog({ open, user, onClose }) {
  if (!user) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Detalhes de {user.nome_completo}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar src={user.foto_perfil} sx={{ width: 56, height: 56, border: '2px solid #e3eafc' }} />
          <Typography variant="h6" fontWeight={700}>{user.nome_completo}</Typography>
        </Box>
        <Typography><b>Email:</b> {user.email}</Typography>
        <Typography><b>Telefone:</b> {user.telefone}</Typography>
        <Typography><b>CPF:</b> {user.cpf}</Typography>
        <Typography><b>Nascimento:</b> {user.data_nascimento}</Typography>
        <Typography><b>Gênero:</b> {user.genero}</Typography>
        <Typography><b>Tipo:</b> {user.tipo_usuario}</Typography>
        {user.cargo && <Typography><b>Cargo:</b> {user.cargo}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function UsersPage() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setUsers(data);
    } catch {
      setSnack({ open: true, msg: 'Erro ao carregar usuários', severity: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleTabChange = (_, v) => {
    setTab(v);
    setIsStaff(v === 1);
  };

  const filteredUsers = users.filter(u => (tab === 0 ? u.tipo_usuario === 'Paciente' : u.tipo_usuario === 'Funcionario'));

  const handleAdd = () => {
    setFormInitial({ tipo_usuario: tab === 0 ? 'Paciente' : 'Funcionario' });
    setFormOpen(true);
  };

  const handleEdit = user => {
    setFormInitial(user);
    setFormOpen(true);
  };

  const handleDelete = async user => {
    if (window.confirm('Deseja excluir este usuário?')) {
      try {
        await api.deleteUsuario(user.id);
        setSnack({ open: true, msg: 'Usuário excluído', severity: 'success' });
        fetchUsers();
      } catch {
        setSnack({ open: true, msg: 'Erro ao excluir', severity: 'error' });
      }
    }
  };

  const handleFormSubmit = async data => {
    try {
      if (data.id) {
        await api.updateUsuario(data.id, data);
        setSnack({ open: true, msg: 'Usuário atualizado', severity: 'success' });
      } else {
        await api.createUsuario(data);
        setSnack({ open: true, msg: 'Usuário criado', severity: 'success' });
      }
      setFormOpen(false);
      fetchUsers();
    } catch {
      setSnack({ open: true, msg: 'Erro ao salvar', severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: theme.palette.primary.main }}>
        Usuários do Sistema
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Tabs value={tab} onChange={handleTabChange} sx={{ minHeight: 48 }}>
          <Tab label="Pacientes" sx={{ fontWeight: 600, fontSize: '1rem' }} />
          <Tab label="Funcionários" sx={{ fontWeight: 600, fontSize: '1rem' }} />
        </Tabs>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ borderRadius: 2, fontWeight: 700 }}>
          Adicionar Novo
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 32px 0 rgba(60,72,100,0.10)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>CPF</TableCell>
                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Data de Nascimento</TableCell>
                {tab === 1 && <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Cargo</TableCell>}
                <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={user.foto_perfil} sx={{ border: '2px solid #e3eafc' }} />
                      <Typography fontWeight={600}>{user.nome_completo}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.cpf}</TableCell>
                  <TableCell>{user.data_nascimento}</TableCell>
                  {tab === 1 && <TableCell>{user.cargo}</TableCell>}
                  <TableCell>
                    <IconButton onClick={() => { setSelected(user); setDetailOpen(true); }} color="info"><Visibility /></IconButton>
                    <IconButton onClick={() => handleEdit(user)} color="primary"><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(user)} color="error"><Delete /></IconButton>
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
        onClose={() => setFormOpen(false)}
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
