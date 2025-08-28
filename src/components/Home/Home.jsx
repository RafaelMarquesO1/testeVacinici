import React from "react";
// import "./Home.css";
import Imagem from "../../assets/sla.png";
import VideoSrc from "../../assets/video.mp4";
import { Box, Typography, Grid, Card, CardContent, CardHeader, Avatar, Container, Button, Chip } from "@mui/material";

// Recharts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Area
} from "recharts";

const Home = () => {
  const data = [
    { year: 1980, semVacinas: 10, comVacinas: 10 },
    { year: 1985, semVacinas: 9.2, comVacinas: 8.8 },
    { year: 1990, semVacinas: 8.5, comVacinas: 7.4 },
    { year: 1995, semVacinas: 7.7, comVacinas: 6.2 },
    { year: 2000, semVacinas: 6.9, comVacinas: 5 },
    { year: 2005, semVacinas: 6.1, comVacinas: 4.2 },
    { year: 2010, semVacinas: 5.4, comVacinas: 3.3 },
    { year: 2015, semVacinas: 4.6, comVacinas: 2.6 },
    { year: 2020, semVacinas: 4.0, comVacinas: 2.0 },
  ];

  const testimonials = [
    {
      nome: "Cátia",
      texto: "Esse app facilitou muito o meu acesso à minha carteira de vacinação.",
      imagem: "src/assets/catia.png",
      titulo: "Incrível!"
    },
    {
      nome: "John",
      texto: "O design é intuitivo e me avisa automaticamente sobre vacinas.",
      imagem: "src/assets/john.png",
      titulo: "Excelente!"
    },
    {
      nome: "Ricardo",
      texto: "O app mantém minhas vacinas organizadas e acessíveis.",
      imagem: "src/assets/ricardo.png",
      titulo: "Magnífico!"
    },
    {
      nome: "Ana",
      texto: "Sinto confiança em acompanhar minha vacinação por aqui.",
      imagem: "src/assets/ana.png",
      titulo: "Seguro!"
    }
  ];

  return (
    <Box component="section" sx={{ pt: { xs: 4, md: 8 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip label="Carteira Digital de Vacinas" color="secondary" sx={{ mb: 2, fontWeight: 700 }} />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.5px' }}>
              Sua carteira de vacina sempre com você
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Com nosso aplicativo mobile, você acessa e armazena sua carteira de vacinação com segurança e rapidez.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button href="/entrar" variant="contained" color="primary" size="large">Começar agora</Button>
              <Button href="#sobre" variant="outlined" color="secondary" size="large">Saiba mais</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <img src={Imagem} alt="Aplicativo de Vacinação" style={{ maxWidth: '100%', height: 'auto', borderRadius: 16 }} />
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={6} sx={{ mt: { xs: 6, md: 10 } }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" color="primary" fontWeight={900} mb={2}>
              Saiba mais
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={4}>
              Sobre nosso aplicativo e vacinas:
            </Typography>
            <Grid container spacing={2}>
              {testimonials.map((t, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardHeader
                      avatar={<Avatar src={t.imagem} sx={{ width: 56, height: 56 }} />}
                      title={<Typography fontWeight={700}>{t.titulo}</Typography>}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">{t.texto}</Typography>
                      <Typography variant="caption" color="success.main" display="block" mt={1}>
                        {t.nome}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Impacto das Vacinas na Mortalidade</Typography>
            <Box sx={{ width: '100%', height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 12]} tickFormatter={(tick) => `${tick}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="semVacinas" stroke="#d62728" strokeDasharray="5 5" name="Sem Vacinas" />
                  <Line type="monotone" dataKey="comVacinas" stroke="#1f77b4" name="Com Vacinas" />
                  <Area type="monotone" dataKey="semVacinas" stroke={false} fill="#fdd" fillOpacity={0.3} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: { xs: 6, md: 10 } }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Para que serve a vacinação?</Typography>
          <Typography variant="body1" color="text.secondary">
            Redução de Doenças: A vacinação reduziu doenças como sarampo, poliomielite e tétano em mais de 90% globalmente.
            <br />Impacto Econômico: A cada US$ 1 investido, há retorno estimado de US$ 44 em benefícios de saúde.
            <br />Erradicação de Doenças: A varíola foi erradicada em 1980 graças a campanhas de vacinação em massa.
            <br />Prevenção de Mortes: Vacinas previnem cerca de 2 a 3 milhões de mortes por ano (OMS).
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 10 } }}>
          <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
            <video style={{ width: '100%', height: 'auto', display: 'block' }} autoPlay loop muted>
              <source src={VideoSrc} type="video/mp4" />
              Seu navegador não suporta vídeos.
            </video>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
