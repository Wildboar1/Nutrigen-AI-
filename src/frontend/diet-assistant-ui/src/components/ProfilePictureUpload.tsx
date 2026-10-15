import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

export default function ProfilePictureUpload() {
  const navigate = useNavigate();
  const { user, updateUserData } = useUser();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !user?.uid) return;

    setUploading(true);
    
    try {
      // Save profile picture to localStorage
      localStorage.setItem(`profilePicture_${user.uid}`, selectedImage);
      
      // Mark picture as uploaded
      localStorage.setItem(`pictureUploaded_${user.uid}`, 'true');
      
      // Update user data with profile picture
      await updateUserData({ photoURL: selectedImage });
      
      setTimeout(() => {
        setUploading(false);
        navigate('/terms', { replace: true });
      }, 500);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setUploading(false);
    }
  };

  const handleSkip = () => {
    if (user?.uid) {
      // Mark picture upload as complete (skipped)
      localStorage.setItem(`pictureUploaded_${user.uid}`, 'true');
    }
    navigate('/terms', { replace: true });
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
      <Container maxWidth="sm">
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={8}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            textAlign: 'center',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Add Profile Picture
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Personalize your account with a profile picture
            </Typography>
          </Box>

          {/* Profile Picture Preview */}
          <Box sx={{ mb: 4, position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={selectedImage || undefined}
              sx={{
                width: 150,
                height: 150,
                margin: '0 auto',
                border: '4px solid',
                borderColor: 'primary.main',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              }}
            >
              {!selectedImage && <PersonIcon sx={{ fontSize: 80 }} />}
            </Avatar>
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-picture-upload"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="profile-picture-upload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 'calc(50% - 85px)',
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </Box>

          {/* Instructions */}
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            {selectedImage
              ? 'Looking good! Click Upload to save your picture.'
              : 'Click the camera icon to choose a profile picture (max 5MB)'}
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="large"
              onClick={handleSkip}
              disabled={uploading}
              sx={{
                minWidth: '120px',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              Skip for Now
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleUpload}
              disabled={!selectedImage || uploading}
              sx={{
                minWidth: '120px',
                background: selectedImage
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : undefined,
              }}
            >
              {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
            </Button>
          </Box>

          {/* Info */}
          <Box sx={{ mt: 4, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="caption" color="textSecondary">
              💡 You can update your profile picture anytime from Settings
            </Typography>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
}
