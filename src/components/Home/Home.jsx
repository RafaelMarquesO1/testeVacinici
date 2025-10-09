import React from "react";
import "./Home.css";
import Imagem from "../../assets/sla.png";
import VideoSrc from "../../assets/video.mp4";
import { Box, Typography, Grid, Card, CardContent, CardHeader, Avatar, Container, Button, Chip, Rating } from "@mui/material";
import { Shield, AttachMoney, GpsFixed, Favorite } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  ComposedChart,
  Bar,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const Home = () => {
  const data = [
    { year: 1980, semVacinas: 10, comVacinas: 10, cobertura: 45 },
    { year: 1985, semVacinas: 9.2, comVacinas: 8.8, cobertura: 52 },
    { year: 1990, semVacinas: 8.5, comVacinas: 7.4, cobertura: 58 },
    { year: 1995, semVacinas: 7.7, comVacinas: 6.2, cobertura: 65 },
    { year: 2000, semVacinas: 6.9, comVacinas: 5, cobertura: 72 },
    { year: 2005, semVacinas: 6.1, comVacinas: 4.2, cobertura: 78 },
    { year: 2010, semVacinas: 5.4, comVacinas: 3.3, cobertura: 85 },
    { year: 2015, semVacinas: 4.6, comVacinas: 2.6, cobertura: 88 },
    { year: 2020, semVacinas: 4.0, comVacinas: 2.0, cobertura: 92 },
  ];

  const testimonials = [
    {
      nome: "Cátia Silva",
      texto: "Esse app facilitou muito o meu acesso à minha carteira de vacinação. Interface muito intuitiva!",
      imagem: "src/assets/catia.png",
      titulo: "Incrível!",
      rating: 5,
      cargo: "Professora"
    },
    {
      nome: "John Santos",
      texto: "O design é intuitivo e me avisa automaticamente sobre vacinas. Recomendo para todos!",
      imagem: "src/assets/john.png",
      titulo: "Excelente!",
      rating: 5,
      cargo: "Engenheiro"
    },
    {
      nome: "Ricardo Lima",
      texto: "O app mantém minhas vacinas organizadas e acessíveis. Muito prático no dia a dia.",
      imagem: "src/assets/ricardo.png",
      titulo: "Magnífico!",
      rating: 5,
      cargo: "Médico"
    },
    {
      nome: "Ana Costa",
      texto: "Sinto confiança em acompanhar minha vacinação por aqui. Segurança em primeiro lugar!",
      imagem: "src/assets/ana.png",
      titulo: "Seguro!",
      rating: 5,
      cargo: "Enfermeira"
    }
  ];

  return (
    <Box component="section" sx={{ 
      pt: { xs: 4, md: 8 },
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      minHeight: '100vh'
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip 
              label="Carteira Digital de Vacinas" 
              sx={{ 
                mb: 2, 
                fontWeight: 700,
                backgroundColor: '#dcfce7',
                color: '#065f46'
              }} 
            />
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 900, 
                mb: 2, 
                letterSpacing: '-0.5px',
                color: '#065f46'
              }}
            >
              Sua carteira de vacina sempre com você
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                color: '#047857'
              }}
            >
              Com nosso aplicativo mobile, você acessa e armazena sua carteira de vacinação com segurança e rapidez.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                href="/entrar" 
                variant="contained" 
                size="large"
                sx={{
                  backgroundColor: '#86efac',
                  color: '#065f46',
                  '&:hover': { backgroundColor: '#6ee7b7' }
                }}
              >
                Começar agora
              </Button>
              <Button 
                href="#sobre" 
                variant="outlined" 
                size="large"
                sx={{
                  borderColor: '#86efac',
                  color: '#065f46',
                  '&:hover': { 
                    borderColor: '#6ee7b7',
                    backgroundColor: 'rgba(134, 239, 172, 0.1)'
                  }
                }}
              >
                Saiba mais
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <img 
                src={Imagem} 
                alt="Aplicativo de Vacinação" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  borderRadius: 16,
                  boxShadow: '0 10px 30px rgba(134, 239, 172, 0.3)'
                }} 
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: { xs: 8, md: 12 }, mb: { xs: 8, md: 12 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                color: '#065f46'
              }}
            >
              Avaliações
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#047857',
                maxWidth: '500px',
                mx: 'auto'
              }}
            >
              Veja o que nossos usuários dizem
            </Typography>
          </Box>
          
          <Grid container spacing={3} justifyContent="center">
            {testimonials.map((t, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '280px',
                      borderRadius: 3,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
                      border: '1px solid #d9f99d',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(134, 239, 172, 0.3)',
                        transform: 'translateY(-5px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Avatar 
                          src={t.imagem} 
                          sx={{ 
                            width: 50, 
                            height: 50, 
                            mx: 'auto',
                            mb: 1,
                            border: '2px solid #a7f3d0'
                          }} 
                        />
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#065f46',
                            mb: 0.5
                          }}
                        >
                          {t.nome}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#10b981', 
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}
                        >
                          {t.cargo}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ my: 1 }}>
                        <Rating 
                          value={t.rating} 
                          readOnly 
                          size="small"
                          sx={{
                            fontSize: '1rem',
                            '& .MuiRating-iconFilled': {
                              color: '#fbbf24'
                            }
                          }}
                        />
                      </Box>
                      
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#374151',
                          fontStyle: 'italic',
                          lineHeight: 1.4,
                          fontSize: '0.8rem',
                          display: 'block',
                          mb: 1
                        }}
                      >
                        "{t.texto.substring(0, 80)}..."
                      </Typography>
                      
                      <Chip 
                        label={t.titulo}
                        size="small"
                        sx={{
                          backgroundColor: '#dcfce7',
                          color: '#065f46',
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          height: '24px'
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mb: 4,
              color: '#065f46'
            }}
          >
            Impacto das Vacinas na Saúde Pública
          </Typography>
          <Box sx={{ maxWidth: '900px', mx: 'auto', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9f99d" />
                <XAxis dataKey="year" stroke="#065f46" />
                <YAxis yAxisId="left" domain={[0, 12]} tickFormatter={(tick) => `${tick}%`} stroke="#065f46" />
                <YAxis yAxisId="right" orientation="right" domain={[40, 100]} tickFormatter={(tick) => `${tick}%`} stroke="#10b981" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'Cobertura Vacinal') return [`${value}%`, name];
                    return [`${value}%`, name];
                  }}
                  contentStyle={{
                    backgroundColor: '#f7fee7',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="right" 
                  dataKey="cobertura" 
                  fill="#a7f3d0" 
                  name="Cobertura Vacinal"
                  fillOpacity={0.8}
                />
                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="semVacinas" 
                  stroke="#ef4444" 
                  fill="#fecaca" 
                  fillOpacity={0.3}
                  name="Mortalidade Sem Vacinas"
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="comVacinas" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Mortalidade Com Vacinas"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mt: { xs: 8, md: 12 }, mb: { xs: 6, md: 8 } }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              color: '#065f46'
            }}
          >
            Por que vacinar?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#047857', 
              mb: 6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Descubra os principais benefícios da vacinação para a saúde pública
          </Typography>
          
          <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              style={{
                paddingBottom: '50px',
              }}
            >
              {[
                {
                  IconComponent: Shield,
                  titulo: "Proteção",
                  descricao: "Redução de 90% nas doenças previníveis",
                  numero: "90%"
                },
                {
                  IconComponent: AttachMoney,
                  titulo: "Economia",
                  descricao: "Retorno de US$ 44 para cada US$ 1 investido",
                  numero: "44x"
                },
                {
                  IconComponent: GpsFixed,
                  titulo: "Erradicação",
                  descricao: "Eliminação completa de doenças como varíola",
                  numero: "100%"
                },
                {
                  IconComponent: Favorite,
                  titulo: "Vidas Salvas",
                  descricao: "3 milhões de mortes evitadas anualmente",
                  numero: "3M+"
                }
              ].map((item, index) => {
                const { IconComponent } = item;
                return (
                  <SwiperSlide key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card 
                        elevation={0}
                        sx={{ 
                          height: '200px',
                          borderRadius: 3,
                          background: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
                          border: '1px solid #d9f99d',
                          textAlign: 'center',
                          p: 2,
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 25px rgba(134, 239, 172, 0.3)',
                            border: '1px solid #a7f3d0'
                          }
                        }}
                      >
                        <Box sx={{ mb: 1.5 }}>
                          <Box 
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              backgroundColor: '#dcfce7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 1
                            }}
                          >
                            <IconComponent 
                              sx={{ 
                                fontSize: '1.5rem', 
                                color: '#065f46' 
                              }} 
                            />
                          </Box>
                          <Chip 
                            label={item.numero}
                            size="small"
                            sx={{
                              backgroundColor: '#86efac',
                              color: '#065f46',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>
                        
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600, 
                            mb: 1, 
                            color: '#065f46'
                          }}
                        >
                          {item.titulo}
                        </Typography>
                        
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#047857',
                            lineHeight: 1.3,
                            fontSize: '0.8rem'
                          }}
                        >
                          {item.descricao}
                        </Typography>
                      </Card>
                    </motion.div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 10 } }}>
          <Box sx={{ 
            borderRadius: 3, 
            overflow: 'hidden', 
            boxShadow: '0 10px 30px rgba(134, 239, 172, 0.2)'
          }}>
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
