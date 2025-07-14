import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  actions?: React.ReactNode;
  sx?: object;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showRefresh = false,
  onRefresh,
  actions,
  sx = {}
}) => {
  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
        ...sx
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#2980b9',
              fontSize: { xs: '1.75rem', md: '2rem' },
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                mt: 0.5,
                fontSize: '0.95rem'
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {showRefresh && onRefresh && (
          <IconButton 
            onClick={onRefresh}
            sx={{
              color: '#2980b9',
              '&:hover': {
                backgroundColor: 'rgba(41, 128, 185, 0.1)'
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        )}
        {actions}
      </Box>
    </Box>
  );
};

export default PageHeader;
