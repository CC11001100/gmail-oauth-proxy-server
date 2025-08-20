import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

/**
 * 404页面组件
 * 当用户访问不存在的路由时显示
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 8
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'text.secondary' }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 2 }}>
          页面未找到
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          抱歉，您访问的页面不存在。可能是链接错误、页面已被删除，或者您输入了错误的URL。
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            sx={{ minWidth: 140 }}
          >
            返回首页
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ minWidth: 140 }}
          >
            返回上页
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound; 