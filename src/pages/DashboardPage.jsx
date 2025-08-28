import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText, useTheme, Skeleton, Paper, FormControl, InputLabel, Select, MenuItem, Button, Stack, Chip
} from '@mui/material';
import StatCard from '../components/dashboard/StatCard';
import RecentActivityTable from '../components/dashboard/RecentActivityTable';
import { People, PersonAdd, Group, TrendingUp, Vaccines, LocationOn } from '@mui/icons-material';
import { api } from '../services/api';

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

  useEffect(() => {
    const loadData = async () => {
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
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  return (
    <Box>
      {/* Header do Dashboard */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visão geral do sistema e indicadores principais
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small">
            <InputLabel id="periodo-label">Período</InputLabel>
            <Select labelId="periodo-label" label="Período" defaultValue="30d" sx={{ minWidth: 140 }}>
              <MenuItem value="7d">Últimos 7 dias</MenuItem>
              <MenuItem value="30d">Últimos 30 dias</MenuItem>
              <MenuItem value="90d">Últimos 90 dias</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="secondary">Atualizar</Button>
        </Stack>
      </Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StatCard
              icon={stat.icon}
              title={stat.title}
              value={stat.value ?? <Skeleton variant="text" width={80} height={36} />}
              change={stat.change}
              color={i % 2 === 0 ? 'primary' : 'secondary'}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RecentActivityTable rows={activities.map(a => ({
            desc: a.desc,
            time: a.time,
            icon: (
              <Avatar sx={{ width: 28, height: 28 }}>
                <TrendingUp fontSize="small" />
              </Avatar>
            )
          }))} />
        </Grid>
      </Grid>
    </Box>
  );
}
