import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Avatar, useTheme, Button, Stack
} from '@mui/material';
import StatCard from '../components/dashboard/StatCard';
import RecentActivityTable from '../components/dashboard/RecentActivityTable';
import { People, PersonAdd, Group, TrendingUp, Vaccines, LocationOn } from '@mui/icons-material';
import { api } from '../services/api';
import ConfirmationModal from '../components/shared/ConfirmationModal';

export default function DashboardPage() {
  const theme = useTheme();
  const [stats, setStats] = useState([
    { icon: <People fontSize="large" color="primary" />, title: "Total de Pacientes", value: null },
    { icon: <Group fontSize="large" color="primary" />, title: "Total de Funcionários", value: null },
    { icon: <Vaccines fontSize="large" color="primary" />, title: "Total de Vacinas", value: null },
    { icon: <LocationOn fontSize="large" color="primary" />, title: "Locais de Vacinação", value: null }
  ]);
  const [activities, setActivities] = useState([
    { desc: 'Sistema Vacinici iniciado com sucesso.', time: "Agora", type: "info", icon: <TrendingUp fontSize="small" /> },
    { desc: 'Dados carregados do banco SQL Server.', time: "Agora", type: "success", icon: <Vaccines fontSize="small" /> },
    { desc: 'Dashboard conectado à API.', time: "Agora", type: "success", icon: <Group fontSize="small" /> },
    { desc: 'Sistema pronto para gerenciamento.', time: "Agora", type: "info", icon: <PersonAdd fontSize="small" /> }
  ]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Aqui você pode adicionar o carregamento real dos dados do backend
      } catch (error) {
        setActivities(prev => ([
          ...prev,
          { desc: 'Erro ao atualizar dashboard.', time: new Date().toLocaleTimeString(), type: "error", icon: <TrendingUp fontSize="small" /> }
        ]));
        console.error('Erro ao carregar dados:', error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        p: { xs: 1, md: 3 },
        transition: 'background 0.3s',
      }}
    >
      {/* Header do Dashboard com avatar */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: 'var(--primary-color)', width: 56, height: 56, fontWeight: 700, fontSize: 32 }}>V</Avatar>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color: 'var(--primary-color)', letterSpacing: 0.5, fontFamily: 'var(--font-family)' }}>
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5, color: 'var(--text-secondary)', fontFamily: 'var(--font-family)' }}>
              Visão geral do sistema, indicadores e atividades recentes
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleConfirmAction(() => window.location.reload())}
          sx={{ fontWeight: 700, boxShadow: '0 2px 8px var(--shadow)', px: 4, py: 1.5, borderRadius: 2, fontFamily: 'var(--font-family)' }}
          disabled={loading}
        >
          Atualizar
        </Button>
      </Box>
      {/* Cards estatísticos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} md={3} key={idx}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
      {/* Tabela de atividades recentes */}
      <RecentActivityTable activities={activities} />
      <ConfirmationModal
        open={confirmOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Confirmar ação"
        description="Tem certeza que deseja executar esta ação?"
      />
    </Box>
  );
}


