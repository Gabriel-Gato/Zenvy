package com.Zenvy.config;

import com.Zenvy.models.Usuario;
import com.Zenvy.repositories.UsuarioRepository;
import com.Zenvy.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Permite acesso a arquivos estáticos
        if (request.getServletPath().startsWith("/uploads/")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String email = jwtService.extractUsername(jwt);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();

                if (jwtService.isTokenValid(jwt, usuario)) {

                    // 🔥 Novo trecho: extrai a role diretamente do token
                    String role = jwtService.extractClaim(jwt, claims -> claims.get("authorities", String.class));

                    // Cria a lista de authorities a partir do JWT
                    List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

                    // Cria o token de autenticação com a role correta
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    usuario,
                                    null,
                                    authorities
                            );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Define o usuário autenticado no contexto de segurança
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
