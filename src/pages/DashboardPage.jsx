import React from 'react';
import {
  Box, Typography, Grid, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, useTheme
} from '@mui/material';
import { People, PersonAdd, Group, TrendingUp } from '@mui/icons-material';

const stats = [
  {
    icon: <People fontSize="large" color="primary" />,
    title: "Total de Pacientes",
    value: "1,482",
    change: "+12 na última semana"
  },
  {
    icon: <Group fontSize="large" color="primary" />,
    title: "Total de Funcionários",
    value: "24",
    change: "+2 no último mês"
  },
  {
    icon: <PersonAdd fontSize="large" color="primary" />,
    title: "Novos Cadastros (Hoje)",
    value: "8"
  },
  {
    icon: <TrendingUp fontSize="large" color="primary" />,
    title: "Usuários Ativos",
    value: "1,506",
    change: "+98.5% de taxa de atividade"
  }
];

const activities = [
  { desc: <>Novo usuário <strong>João Silva</strong> cadastrado.</>, time: "2 min atrás" },
  { desc: <>Novo paciente <strong>Maria Oliveira</strong> cadastrado por <strong>Dr(a). Ana</strong>.</>, time: "15 min atrás" },
  { desc: <>Dados do usuário <strong>Carlos Pereira</strong> atualizados.</>, time: "1 hora atrás" },
  { desc: <>Relatório de usuários ativos gerado.</>, time: "3 horas atrás" }
];

export default function DashboardPage() {
  const theme = useTheme();
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
