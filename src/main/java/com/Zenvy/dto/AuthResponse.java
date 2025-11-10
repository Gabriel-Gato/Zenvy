package com.Zenvy.dto;

import com.Zenvy.models.Usuario;

public record AuthResponse(String accessToken, String refreshToken, Usuario usuario) {}