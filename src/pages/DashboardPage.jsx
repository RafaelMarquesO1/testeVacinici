import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Container, Chip, Button
} from '@mui/material';
import { People, Group, Vaccines, CalendarToday, Refresh } from '@mui/icons-material';
import { api } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPacientes: 0,
    totalFuncionarios: 0,
    totalVacinas: 0,
    agendamentosHoje: 0
  });
  const [chartData, setChartData] = useState({
    vacinacoesMes: [],
    tiposVacina: []
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ['#065f46', '#047857', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Dados fictícios
    setStats({
      totalPacientes: 1247,
      totalFuncionarios: 23,
      totalVacinas: 8,
      agendamentosHoje: 15
    });

    const vacinacoesMes = [
      { mes: 'Jan', vacinas: 145 },
      { mes: 'Fev', vacinas: 178 },
      { mes: 'Mar', vacinas: 203 },
      { mes: 'Abr', vacinas: 189 },
      { mes: 'Mai', vacinas: 234 },
      { mes: 'Jun', vacinas: 267 },
      { mes: 'Jul', vacinas: 198 },
      { mes: 'Ago', vacinas: 221 },
      { mes: 'Set', vacinas: 256 },
      { mes: 'Out', vacinas: 289 },
      { mes: 'Nov', vacinas: 312 },
      { mes: 'Dez', vacinas: 298 }
    ];

    const tiposVacina = [
      { nome: 'COVID-19', valor: 32 },
      { nome: 'Influenza', valor: 24 },
      { nome: 'Hepatite B', valor: 18 },
      { nome: 'BCG', valor: 12 },
      { nome: 'Febre Amarela', valor: 8 },
      { nome: 'Tétano', valor: 6 }
    ];

    setChartData({ vacinacoesMes, tiposVacina });
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
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
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Chip 
              label="Sistema de Gestão" 
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
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: '#047857', mb: 4 }}>
              Dados demonstrativos do sistema de vacinação
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
              boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(6, 95, 70, 0.15)'
              }
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
              boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(6, 95, 70, 0.15)'
              }
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
              boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(6, 95, 70, 0.15)'
              }
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
              boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(6, 95, 70, 0.15)'
              }
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

        {/* Gráficos */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #d9f99d',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#065f46', fontWeight: 600 }}>
                  Vacinações por Mês
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.vacinacoesMes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d9f99d" />
                    <XAxis dataKey="mes" stroke="#047857" />
                    <YAxis stroke="#047857" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#f0fdf4', 
                        border: '1px solid #10b981',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="vacinas" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #d9f99d',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(6, 95, 70, 0.1)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#065f46', fontWeight: 600 }}>
                  Tipos de Vacinas (%)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.tiposVacina}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="valor"
                      label={({ nome, valor }) => `${nome}: ${valor}%`}
                    >
                      {chartData.tiposVacina.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#f0fdf4', 
                        border: '1px solid #10b981',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}