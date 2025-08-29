import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Avatar, useTheme, Skeleton, Button, Stack, CircularProgress, Fade, Paper
} from '@mui/material';
import StatCard from '../components/dashboard/StatCard';
import RecentActivityTable from '../components/dashboard/RecentActivityTable';
import { People, PersonAdd, Group, TrendingUp, Vaccines, LocationOn } from '@mui/icons-material';
import { api } from '../services/api';
import ConfirmationModal from '../components/shared/ConfirmationModal';

const activities = [
  { desc: <>Sistema <strong>Vacinici</strong> iniciado com sucesso.</>, time: "Agora" },
  { desc: <>Dados carregados do <strong>banco SQL Server</strong>.</>, time: "Agora" },
  { desc: <>Dashboard <strong>conectado à API</strong>.</>, time: "Agora" },
  { desc: <>Sistema pronto para <strong>gerenciamento</strong>.</>, time: "Agora" }
];

export default function DashboardPage() {
  const theme = useTheme();
  const [stats, setStats] = useState([
    { icon: <People fontSize="large" color="primary" />, title: "Total de Pacientes", value: null },
    { icon: <Group fontSize="large" color="primary" />, title: "Total de Funcionários", value: null },
    { icon: <Vaccines fontSize="large" color="primary" />, title: "Total de Vacinas", value: null },
    { icon: <LocationOn fontSize="large" color="primary" />, title: "Locais de Vacinação", value: null }
  ]);
  const [activities, setActivities] = useState([
  { desc: <>Sistema <strong>Vacinici</strong> iniciado com sucesso.</>, time: "Agora", type: "info", icon: <TrendingUp fontSize="small" /> },
  { desc: <>Dados carregados do <strong>banco SQL Server</strong>.</>, time: "Agora", type: "success", icon: <Vaccines fontSize="small" /> },
  { desc: <>Dashboard <strong>conectado à API</strong>.</>, time: "Agora", type: "success", icon: <Group fontSize="small" /> },
  { desc: <>Sistema pronto para <strong>gerenciamento</strong>.</>, time: "Agora", type: "info", icon: <PersonAdd fontSize="small" /> }
  ]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [usuarios, vacinas, locais] = await Promise.all([
          api.getUsuarios(),
          api.getVacinas(),
          api.getLocaisVacinacao()
        ]);
        const pacientes = usuarios.filter(u => u.tipoUsuario === 'Paciente');
        const funcionarios = usuarios.filter(u => u.tipoUsuario === 'Funcionario');
        setStats([
          {
            icon: <People fontSize="large" color="primary" />,
            title: "Total de Pacientes",
            value: pacientes.length.toString(),
            change: `${pacientes.length} pacientes cadastrados`
          },
          {
            icon: <Group fontSize="large" color="primary" />,
            title: "Total de Funcionários",
            value: funcionarios.length.toString(),
            change: `${funcionarios.length} funcionários ativos`
          },
          {
            icon: <Vaccines fontSize="large" color="primary" />,
            title: "Total de Vacinas",
            value: vacinas.length.toString(),
            change: `${vacinas.length} vacinas disponíveis`
          },
          {
            icon: <LocationOn fontSize="large" color="primary" />,
            title: "Locais de Vacinação",
            value: locais.length.toString(),
            change: `${locais.length} locais cadastrados`
          }
        ]);
        setActivities(prev => ([
          ...prev,
          { desc: <>Dashboard atualizado com sucesso.</>, time: new Date().toLocaleTimeString(), type: "success", icon: <TrendingUp fontSize="small" /> }
        ]));
      } catch (error) {
        setActivities(prev => ([
          ...prev,
          { desc: <>Erro ao atualizar dashboard.</>, time: new Date().toLocaleTimeString(), type: "error", icon: <TrendingUp fontSize="small" /> }
        ]));
        console.error('Erro ao carregar dados:', error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Função para abrir modal de confirmação antes de ações importantes
  const handleConfirmAction = (action) => {
    setPendingAction(() => action);
    setConfirmOpen(true);
  };
  const handleConfirm = () => {
    if (pendingAction) pendingAction();
    setConfirmOpen(false);
    setPendingAction(null);
  };
  const handleCancel = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.mode === 'dark' ? 'linear-gradient(120deg, #0A1F12 0%, #0F2A18 100%)' : 'linear-gradient(120deg, #F0FDF4 0%, #ECFDF5 100%)', p: { xs: 1, md: 3 } }}>
      {/* Header do Dashboard com avatar */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 56, height: 56, fontWeight: 700, fontSize: 32 }}>V</Avatar>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: theme.palette.primary.main, letterSpacing: 0.5 }}>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Visão geral do sistema, indicadores e atividades recentes
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleConfirmAction(() => window.location.reload())}
          sx={{ fontWeight: 700, boxShadow: '0 2px 8px rgba(34,197,94,0.12)', px: 4, py: 1.5, borderRadius: 2 }}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {loading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </Box>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Fade in timeout={600}>
              <Paper elevation={6} sx={{ borderRadius: 3, p: 2, background: theme.palette.mode === 'dark' ? '#10291A' : '#F7FFF9', boxShadow: '0 4px 24px rgba(34,197,94,0.10)' }}>
                <StatCard
                  icon={stat.icon}
                  title={stat.title}
                  value={stat.value ?? <Skeleton variant="text" width={80} height={36} />}
                  change={stat.change}
                  color={i % 2 === 0 ? 'primary' : 'secondary'}
                />
              </Paper>
            </Fade>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={4} sx={{ borderRadius: 3, p: 2, background: theme.palette.mode === 'dark' ? '#142D1F' : '#F3FDF7', boxShadow: '0 2px 12px rgba(34,197,94,0.08)' }}>
            <RecentActivityTable rows={activities.map(a => ({
              desc: a.desc,
              time: a.time,
              icon: (
                <Avatar sx={{ width: 28, height: 28, bgcolor: a.type === 'error' ? 'error.main' : a.type === 'success' ? 'success.main' : 'info.main' }}>
                  {a.icon}
                </Avatar>
              )
            }))} />
          </Paper>
        </Grid>
      </Grid>
      {/* Modal de confirmação para ações */}
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmar ação"
        message="Tem certeza que deseja executar esta ação?"
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </Box>
  );
}
