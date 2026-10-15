import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [accepted, setAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  // Check if user has already accepted T&C
  React.useEffect(() => {
    if (user?.uid) {
      const termsAccepted = localStorage.getItem(`termsAccepted_${user.uid}`);
      const onboardingComplete = localStorage.getItem(`onboardingComplete_${user.uid}`);
      
      // Only redirect if both T&C and onboarding are complete
      if (termsAccepted === 'true' && onboardingComplete === 'true') {
        navigate('/dashboard', { replace: true });
      } else if (termsAccepted === 'true') {
        // T&C accepted but onboarding not complete, go to onboarding
        navigate('/onboarding', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleAccept = () => {
    if (!accepted) {
      setShowError(true);
      return;
    }

    // Save acceptance status
    if (user?.uid) {
      localStorage.setItem(`termsAccepted_${user.uid}`, 'true');
    }

    setShowError(false);
    navigate('/onboarding', { replace: true });
  };

  const handleDecline = () => {
    setAccepted(false);
    setShowError(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to NutriGen AI
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Please read and accept our Terms and Conditions to continue
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Terms and Conditions Content */}
          <Card sx={{ mb: 4, maxHeight: '400px', overflowY: 'auto' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Terms and Conditions
              </Typography>

              <Box sx={{ mt: 3, color: 'textSecondary', lineHeight: 1.8 }}>
                {/* Content Placeholder - User will update this later */}
                <Typography variant="body2" paragraph sx={{ minHeight: '200px' }}>
                  {/* PLACEHOLDER FOR TERMS AND CONDITIONS CONTENT */}
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: '#f5f5f5',
                      borderRadius: 1,
                      border: '2px dashed #ccc',
                      textAlign: 'center',
                      color: '#999',
                    }}
                  >
                    <Typography variant="body2">
                      Terms and Conditions content will be displayed here.
                      <br />
                      Please scroll through this section before accepting.
                    </Typography>
                  </Box>
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {showError && (
            <Alert
              severity="error"
              icon={<ErrorIcon />}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                You must accept the Terms and Conditions to proceed further
              </Typography>
            </Alert>
          )}

          {/* Acceptance Checkbox */}
          <Box sx={{ mb: 4, p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={accepted}
                  onChange={(e) => {
                    setAccepted(e.target.checked);
                    setShowError(false);
                  }}
                  color="primary"
                  size="medium"
                  sx={{ mr: 1 }}
                />
              }
              label={
                <Typography variant="body2">
                  I have read and agree to the{' '}
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      cursor: 'pointer',
                    }}
                  >
                    Terms and Conditions
                  </Typography>
                </Typography>
              }
            />
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outlined"
              color="error"
              size="large"
              onClick={handleDecline}
              sx={{
                minWidth: '150px',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              Decline
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleAccept}
              disabled={!accepted}
              endIcon={accepted && <CheckCircleIcon />}
              sx={{
                minWidth: '150px',
                background: accepted
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : undefined,
              }}
            >
              Accept & Continue
            </Button>
          </Box>

          {/* Additional Info */}
          <Box sx={{ mt: 4, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="caption" color="textSecondary">
              ℹ️ By accepting these terms, you agree to use NutriGen AI according to our
              guidelines. You can review and update your preferences anytime in Settings.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
