package com.Zenvy.config;

import com.Zenvy.models.Usuario;
import com.Zenvy.models.enums.Role;
import com.Zenvy.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        final String ADMIN_EMAIL = "admin@zenvy.com";


        if (!usuarioRepository.existsByEmail(ADMIN_EMAIL)) {
            Usuario anfitriao = new Usuario();
            anfitriao.setNome("Camila Silva");
            anfitriao.setEmail(ADMIN_EMAIL);
            anfitriao.setSenha(passwordEncoder.encode("123456"));
            anfitriao.setTelefone("1198765-4321");
            anfitriao.setRole(Role.ROLE_ANFITRIAO); // ⬅️ GARANTE A ROLE
            anfitriao.setFotoPerfil("Camila.png");

            usuarioRepository.save(anfitriao);

            System.out.println("✅ Usuário anfitrião criado automaticamente: " + ADMIN_EMAIL + " / 123456");
        } else {
            System.out.println("ℹ️ O anfitrião administrador já existe.");
        }
    }
}