import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, useTheme
} from '@mui/material';
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
    { icon: <People fontSize="large" color="primary" />, title: "Total de Pacientes", value: "0" },
    { icon: <Group fontSize="large" color="primary" />, title: "Total de Funcionários", value: "0" },
    { icon: <Vaccines fontSize="large" color="primary" />, title: "Total de Vacinas", value: "0" },
    { icon: <LocationOn fontSize="large" color="primary" />, title: "Locais de Vacinação", value: "0" }
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
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: theme.palette.primary.main }}>
        Gerenciamento de Usuários
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderRadius: 3,
                background: 'linear-gradient(120deg, #fff 80%, #e3eafc 100%)',
                boxShadow: '0 4px 32px 0 rgba(60,72,100,0.10)'
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.light,
                  width: 60,
                  height: 60,
                  color: theme.palette.primary.main,
                  fontSize: 32,
                  border: `2px solid ${theme.palette.divider}`
                }}
              >
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{stat.title}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                {stat.change && (
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 500 }}>
                    {stat.change}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(120deg, #fff 90%, #e3eafc 100%)' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: theme.palette.primary.main }}>
          Atividade Recente
        </Typography>
        <List>
          {activities.map((activity, i) => (
            <ListItem key={i} divider={i < activities.length - 1}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, color: '#fff' }}>
                  <TrendingUp />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={activity.desc} secondary={activity.time} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
