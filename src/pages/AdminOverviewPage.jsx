import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, useTheme, Skeleton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { api } from '../services/api';

const COLORS = ['#34c77a', '#2a9d8f', '#f4a261', '#e76f51', '#264653'];

export default function AdminOverviewPage() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [vacinas, setVacinas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [agendamentosData, historicoData, vacinasData] = await Promise.all([
          api.getAgendamentos(),
          api.getHistoricoVacinacao(),
          api.getVacinas()
        ]);
        setAgendamentos(agendamentosData);
        setHistorico(historicoData);
        setVacinas(vacinasData);
      } catch (error) {
        console.error('Erro ao buscar dados do backend:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalAgendamentos = agendamentos.length;
  const agendamentosRealizados = agendamentos.filter(a => a.status === 'realizado').length;
  const agendamentosFaltados = agendamentos.filter(a => a.status === 'faltou').length;

  const statusData = [
    { status: 'Realizados', count: agendamentosRealizados },
    { status: 'Faltaram', count: agendamentosFaltados },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: { xs: 1, md: 4 },
        background: 'var(--bg-primary)',
        transition: 'background 0.3s',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: 'var(--primary-color)',
            letterSpacing: 0.5,
            fontFamily: 'var(--font-family)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mr: 2,
          }}
        >
          <span role="img" aria-label="dashboard">📊</span> Controle Geral do Posto
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family)',
            fontWeight: 500,
            letterSpacing: 0.2,
            mt: 0.5,
          }}
        >
          Indicadores em tempo real
        </Typography>
      </Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <Grid item xs={12} md={3} key={i}>
              <Paper
                elevation={0}
                className="dashboard-card animated-card"
                sx={{
                  p: 3,
                  borderRadius: 4,
                  minHeight: 180,
                  bgcolor: 'var(--bg-card)',
                  boxShadow: '0 2px 12px var(--shadow)',
                  animation: 'fadeInUp 0.5s',
                }}
              >
                <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={80} />
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Total de Agendamentos */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={1}
                className="dashboard-card"
                sx={{
                  p: 3,
                  borderRadius: 4,
                  minHeight: 180,
                  bgcolor: 'var(--bg-card)',
                  boxShadow: '0 2px 12px var(--shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: 'var(--primary-color)',
                    letterSpacing: 0.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  <span role="img" aria-label="total">📋</span> Total de Agendamentos
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    color: 'var(--text-primary)',
                    fontWeight: 800,
                    fontFamily: 'var(--font-family)',
                    fontSize: { xs: '2.2rem', md: '2.8rem' },
                  }}
                >
                  {totalAgendamentos}
                </Typography>
              </Paper>
            </Grid>
            {/* Agendamentos Realizados */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={1}
                className="dashboard-card"
                sx={{
                  p: 3,
                  borderRadius: 4,
                  minHeight: 180,
                  bgcolor: 'var(--bg-card)',
                  boxShadow: '0 2px 12px var(--shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: '#34c77a',
                    letterSpacing: 0.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  <span role="img" aria-label="realizado">✅</span> Realizados
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    color: '#34c77a',
                    fontWeight: 800,
                    fontFamily: 'var(--font-family)',
                    fontSize: { xs: '2.2rem', md: '2.8rem' },
                  }}
                >
                  {agendamentosRealizados}
                </Typography>
              </Paper>
            </Grid>
            {/* Agendamentos Faltados */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={1}
                className="dashboard-card"
                sx={{
                  p: 3,
                  borderRadius: 4,
                  minHeight: 180,
                  bgcolor: 'var(--bg-card)',
                  boxShadow: '0 2px 12px var(--shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: '#e76f51',
                    letterSpacing: 0.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  <span role="img" aria-label="faltou">❌</span> Faltaram
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    color: '#e76f51',
                    fontWeight: 800,
                    fontFamily: 'var(--font-family)',
                    fontSize: { xs: '2.2rem', md: '2.8rem' },
                  }}
                >
                  {agendamentosFaltados}
                </Typography>
              </Paper>
            </Grid>
            {/* Gráfico de status dos agendamentos */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={1}
                className="dashboard-card"
                sx={{
                  p: 3,
                  borderRadius: 4,
                  minHeight: 180,
                  bgcolor: 'var(--bg-card)',
                  boxShadow: '0 2px 12px var(--shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: 'var(--primary-color)',
                    letterSpacing: 0.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  <span role="img" aria-label="calendar">📅</span> Agendamentos por Status
                </Typography>
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={statusData} layout="vertical">
                    <XAxis type="number" allowDecimals={false} stroke="#b0b0b0" fontSize={13} hide />
                    <YAxis type="category" dataKey="status" stroke="#b0b0b0" fontSize={13} width={80} />
                    <Tooltip contentStyle={{ borderRadius: 8, boxShadow: '0 2px 8px #eee' }} />
                    <Bar dataKey="count" fill="var(--primary-color)" radius={[8, 8, 8, 8]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            {/* Gráfico de vacinas */}
            <Grid item xs={12}>
              <Paper
                elevation={1}
                className="dashboard-card"
                sx={{
                  p: 3,
                  borderRadius: 4,
                  minHeight: 340,
                  bgcolor: 'var(--bg-card)',
                  boxShadow: '0 2px 12px var(--shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: '1px solid var(--border-color)',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'var(--primary-color)',
                    letterSpacing: 0.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontFamily: 'var(--font-family)',
                  }}
                >
                  <span role="img" aria-label="vacina">💉</span> Vacinas Aplicadas por Tipo
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={vacinas} dataKey="count" nameKey="nome" cx="50%" cy="50%" outerRadius={70} fill="var(--primary-color)" label>
                      {vacinas.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, boxShadow: '0 2px 8px #eee' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 14 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
