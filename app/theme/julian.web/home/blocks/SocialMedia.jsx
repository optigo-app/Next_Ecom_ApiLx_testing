"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import Link from "next/link";
import { Box, Container, IconButton, Typography, styled } from "@mui/material";
import { HeaderV2 } from "./Header";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import SpireBox from "./Svg";

const VideoCard = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: 0,
  overflow: "hidden",
  background: theme.palette.background.paper,
  cursor: "pointer",
  transition: "transform 0.25s ease",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(1.5),
  left: theme.spacing(1.5),
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(6px)",
  borderRadius: "50%",
  padding: 10,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  zIndex: 2,
}));

/* ---------- Main Component ---------- */

export default function SocialMediaVideoSection({ }) {
  const videoData = [
    {
      id: 1,
      video: "/social_media/Instagram.mp4",
      icon: <InstagramIcon />,
      platform: "https://www.instagram.com/",
      title: 'Instagram',
    },
    {
      id: 2,
      video: "/social_media/Facebook.mp4",
      icon: <FacebookIcon />,
      platform: "https://www.facebook.com/",
      title: 'Facebook',
    },
    {
      id: 3,
      video: "/social_media/Pinterest.mp4",
      icon: <PinterestIcon />,
      platform: "https://www.pinterest.com/",
      title: 'Pinterest',
    },
    {
      id: 4,
      video: "/social_media/Youtube.mp4",
      icon: <YouTubeIcon />,
      platform: "https://www.youtube.com/",
      title: 'YouTube',
    },
  ];
  const videoRefs = useRef([]);

  const handleMouseEnter = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => { });
    }
  };

  const handleMouseLeave = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };


  function VideoCard({ item }) {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
      videoRef.current?.play();
    };

    const handleMouseLeave = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };

    return (

      <Link href={item.platform} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        <Box
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            cursor: 'pointer',
            height: {
              xs: 520,
              md: 520,
            },

            '&:hover .video': {
              transform: 'scale(1.08)',
            },

            '&:hover .overlay': {
              opacity: 1,
            },

            '&:hover .content': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          }}
        >
          {/* Video */}
          <Box
            component="video"
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            className="video"
            src={item.video}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform .8s cubic-bezier(.22,.61,.36,1)',
            }}
          />

          {/* Overlay */}
          <Box
            className="overlay"
            sx={{
              position: 'absolute',
              inset: 0,
              // background:
              //     'linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.15))',
              opacity: 0,
              transition: '.5s ease',
            }}
          />

          {/* Hover Content */}
          <Box
            className="content"
            sx={{
              position: 'absolute',
              bottom: 40,
              left: 24,
              color: '#fff',
              zIndex: 2,
              opacity: 0,
              transform: 'translateY(20px)',
              transition: '.45s ease',
            }}
          >
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 500,
                mb: 1,
              }}
            >
              {/* {item.title} */}
              Explore
            </Typography>


          </Box>

          {/* Bottom Label */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              bgcolor: '#fff',
              py: 1.5,
              px: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 800,
                color: '#444',
              }}
            >
              {item.title}
            </Typography>
          </Box>
        </Box>
      </Link>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pt: 2, pb: 4 }}>
      <Typography
        sx={{
          fontFamily: '"EB Garamond", serif',
          fontSize: { xs: 34, md: 42 },
          fontWeight: 400,
          mt: 5,
          color: '#2C2C2C',
          mb: 3,
          textAlign: 'center',
        }}
      >
        Watch & Buy
      </Typography>

      <Swiper
        loop
        spaceBetween={4}
        modules={[Pagination]}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 1.3 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 4 },
        }}
      >
        {videoData?.map((item, index) => (
          <SwiperSlide key={index}>
            <VideoCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}
